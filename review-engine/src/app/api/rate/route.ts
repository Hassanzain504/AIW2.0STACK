import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createAdminSupabase } from "@/lib/supabase/admin"
import { one } from "@/lib/supabase/rows"
import { getBusinessById } from "@/lib/review/business"
import { cancelPendingMessages } from "@/lib/review/create"
import { decideRoute } from "@/lib/review/gate"
import { googleReviewUrl } from "@/lib/review/links"
import { draftReview } from "@/lib/review/draft"
import { buildOwnerAlertEmail } from "@/lib/email/templates"
import { sendEmail } from "@/lib/email/send"

const schema = z.object({
  token: z.string().min(8),
  rating: z.number().int().min(1).max(5),
})

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
  const { token, rating } = parsed.data
  const supabase = createAdminSupabase()

  const { data: request } = await supabase
    .from("review_requests")
    .select(
      "id, business_id, status, rating, expires_at, contacts(name, email, phone), jobs(service_type, tech_name)"
    )
    .eq("token", token)
    .maybeSingle()

  if (!request) {
    return NextResponse.json({ error: "That link is not valid." }, { status: 404 })
  }
  if (new Date(request.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "That link has expired." }, { status: 410 })
  }

  const business = await getBusinessById(request.business_id)
  if (!business) {
    return NextResponse.json({ error: "That link is not valid." }, { status: 404 })
  }

  const contact = one(request.contacts) as {
    name: string | null
    email: string | null
    phone: string | null
  } | null
  const job = one(request.jobs) as {
    service_type: string | null
    tech_name: string | null
  } | null

  const decision = decideRoute(rating, business.gate_mode)

  // A second tap on the same link must not double-count or re-alert the owner.
  const alreadyRated = request.rating !== null

  if (!alreadyRated) {
    await supabase
      .from("review_requests")
      .update({
        rating,
        status: "rated",
        rated_at: new Date().toISOString(),
      })
      .eq("id", request.id)

    await supabase.from("responses").insert({
      business_id: business.id,
      review_request_id: request.id,
      rating,
      routed_to: decision.route,
      contact_name: contact?.name ?? null,
      contact_email: contact?.email ?? null,
      contact_phone: contact?.phone ?? null,
    })

    // Nobody chases a customer who has already answered.
    await cancelPendingMessages(request.id)

    // An unhappy customer is worth a phone call the same day, so the owner
    // hears about it now rather than waiting for a comment that may not come.
    if (decision.route === "private") {
      const alertTo =
        business.owner_alert_email?.trim() || business.reply_to_email?.trim()
      if (alertTo) {
        const content = buildOwnerAlertEmail({
          business,
          rating,
          comment: null,
          contactName: contact?.name ?? null,
          contactEmail: contact?.email ?? null,
          contactPhone: contact?.phone ?? null,
          serviceType: job?.service_type ?? null,
        })
        await sendEmail({ business, to: alertTo, content })
      }
    }
  }

  return NextResponse.json({
    ok: true,
    route: decision.route,
    showGoogle: decision.showGoogle,
    askForFeedback: decision.askForFeedback,
    googleUrl: decision.showGoogle ? googleReviewUrl(business) : null,
    draft:
      decision.route === "google"
        ? draftReview({
            businessName: business.name,
            serviceType: job?.service_type ?? null,
            techName: job?.tech_name ?? null,
            rating,
          })
        : null,
  })
}
