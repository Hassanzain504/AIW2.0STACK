import { createAdminSupabase } from "@/lib/supabase/admin"
import { one } from "@/lib/supabase/rows"
import { getBusinessById } from "@/lib/review/business"

export const dynamic = "force-dynamic"

/**
 * One-click opt out. Gmail and Yahoo require the List-Unsubscribe header to
 * work without a confirmation step, so this page acts on load rather than
 * asking "are you sure".
 */
export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = createAdminSupabase()

  const { data: request } = await supabase
    .from("review_requests")
    .select("id, business_id, contact_id, contacts(email, phone)")
    .eq("token", token)
    .maybeSingle()

  let businessName = "this business"

  if (request) {
    const business = await getBusinessById(request.business_id)
    if (business) businessName = business.name

    const contact = one(request.contacts) as {
      email: string | null
      phone: string | null
    } | null

    if (request.contact_id) {
      await supabase
        .from("contacts")
        .update({ opted_out_at: new Date().toISOString() })
        .eq("id", request.contact_id)
        .is("opted_out_at", null)
    }

    const email = contact?.email?.toLowerCase() ?? null
    const phone = contact?.phone ?? null

    if (email || phone) {
      // The suppression indexes are partial, which PostgREST cannot name as an
      // upsert conflict target, so this checks first rather than relying on
      // ON CONFLICT.
      const { data: existing } = await supabase
        .from("suppressions")
        .select("id")
        .eq("business_id", request.business_id)
        .or(
          [email ? `email.eq.${email}` : null, phone ? `phone.eq.${phone}` : null]
            .filter(Boolean)
            .join(",")
        )
        .limit(1)

      if (!existing || existing.length === 0) {
        await supabase.from("suppressions").insert({
          business_id: request.business_id,
          email,
          phone,
          reason: "unsubscribed",
        })
      }
    }

    // Stop anything already queued for this person.
    if (request.contact_id) {
      await supabase
        .from("messages")
        .update({ status: "cancelled" })
        .eq("contact_id", request.contact_id)
        .in("status", ["scheduled", "ready"])
    }

    await supabase
      .from("review_requests")
      .update({ status: "stopped" })
      .eq("id", request.id)
      .in("status", ["pending", "opened"])
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">You are opted out</h1>
      <p className="mt-2 text-sm text-muted">
        {businessName} will not send you any more review requests. Nothing else
        about your account changes.
      </p>
    </main>
  )
}
