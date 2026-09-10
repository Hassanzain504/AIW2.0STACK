import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createAdminSupabase } from "@/lib/supabase/admin"
import { one } from "@/lib/supabase/rows"
import { getBusinessById } from "@/lib/review/business"
import { buildOwnerAlertEmail } from "@/lib/email/templates"
import { sendEmail } from "@/lib/email/send"

const schema = z.object({
  token: z.string().min(8),
  comment: z.string().trim().min(1).max(4000),
  name: z.string().trim().max(200).optional(),
  email: z.string().trim().email().max(320).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
})

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please write a short note before sending." },
      { status: 400 }
    )
  }
  const { token, comment, name, email, phone } = parsed.data
  const supabase = createAdminSupabase()

  const { data: request } = await supabase
    .from("review_requests")
    .select("id, business_id, rating, jobs(service_type)")
    .eq("token", token)
    .maybeSingle()

  if (!request || request.rating === null) {
    return NextResponse.json({ error: "That link is not valid." }, { status: 404 })
  }

  const { data: response } = await supabase
    .from("responses")
    .select("id, comment, contact_name, contact_email, contact_phone")
    .eq("review_request_id", request.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!response) {
    return NextResponse.json({ error: "That link is not valid." }, { status: 404 })
  }

  // Only the first submission alerts the owner. Reloading the thank-you page
  // and sending again should not fire a second email.
  const alreadyHadComment = Boolean(response.comment?.trim())

  await supabase
    .from("responses")
    .update({
      comment,
      contact_name: name || response.contact_name,
      contact_email: email || response.contact_email,
      contact_phone: phone || response.contact_phone,
    })
    .eq("id", response.id)

  await supabase
    .from("review_requests")
    .update({ status: "completed" })
    .eq("id", request.id)

  if (!alreadyHadComment) {
    const business = await getBusinessById(request.business_id)
    const alertTo =
      business?.owner_alert_email?.trim() || business?.reply_to_email?.trim()
    if (business && alertTo) {
      const job = one(request.jobs) as { service_type: string | null } | null
      const content = buildOwnerAlertEmail({
        business,
        rating: request.rating,
        comment,
        contactName: name || response.contact_name,
        contactEmail: email || response.contact_email,
        contactPhone: phone || response.contact_phone,
        serviceType: job?.service_type ?? null,
      })
      await sendEmail({
        business,
        to: alertTo,
        content: {
          ...content,
          subject: `They wrote back: ${content.subject}`,
        },
      })
    }
  }

  return NextResponse.json({ ok: true })
}
