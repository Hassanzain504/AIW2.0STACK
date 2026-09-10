import { redirect } from "next/navigation"
import { createServerSupabase } from "@/lib/supabase/server"
import { createAdminSupabase } from "@/lib/supabase/admin"
import { one } from "@/lib/supabase/rows"
import { staffUrl } from "@/lib/review/links"
import SmsOutbox, { type OutboxRow } from "@/components/SmsOutbox"
import AckButton from "@/components/AckButton"

export const dynamic = "force-dynamic"

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createServerSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")

  // Row level security scopes every query below to businesses this user owns.
  const BUSINESS_COLUMNS =
    "id, name, slug, staff_token, gate_mode, google_review_url, google_place_id"

  let { data: business } = await supabase
    .from("businesses")
    .select(BUSINESS_COLUMNS)
    .limit(1)
    .maybeSingle()

  // Nothing owned yet. If onboarding recorded this address as the owner, claim
  // it now. Supabase has already proven the address, because signing in means
  // opening a link sent to it, so matching on it is safe and it is what keeps
  // client onboarding free of hand-run SQL.
  if (!business && user.email) {
    const admin = createAdminSupabase()
    const { data: claimed } = await admin
      .from("businesses")
      .update({ owner_user_id: user.id })
      .ilike("owner_email", user.email)
      .is("owner_user_id", null)
      .select(BUSINESS_COLUMNS)
      .maybeSingle()

    if (claimed) business = claimed
  }

  if (!business) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-xl font-semibold">No business linked yet</h1>
        <p className="mt-2 text-sm text-muted">
          This account is signed in as {user.email} but no business lists that
          address as its owner. Whoever set the client up can add it on the
          client&apos;s page, and this dashboard will attach itself next time
          you sign in.
        </p>
      </main>
    )
  }

  const [{ data: stats }, { data: readyRows }, { data: feedback }] =
    await Promise.all([
      supabase
        .from("business_stats")
        .select("*")
        .eq("business_id", business.id)
        .maybeSingle(),
      supabase
        .from("messages")
        .select("id, to_phone, body, kind, scheduled_at, contacts(name)")
        .eq("business_id", business.id)
        .eq("status", "ready")
        .order("scheduled_at", { ascending: true })
        .limit(50),
      supabase
        .from("responses")
        .select("id, rating, comment, contact_name, contact_phone, created_at")
        .eq("business_id", business.id)
        .eq("routed_to", "private")
        .is("acknowledged_at", null)
        .order("created_at", { ascending: false })
        .limit(10),
    ])

  const outbox: OutboxRow[] = (readyRows ?? []).map((row) => {
    const contact = one(row.contacts) as { name: string | null } | null
    return {
      id: row.id,
      to_phone: row.to_phone,
      body: row.body,
      kind: row.kind,
      scheduled_at: row.scheduled_at,
      contactName: contact?.name ?? null,
    }
  })

  const googleReady = Boolean(
    business.google_review_url || business.google_place_id
  )

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="text-xl font-semibold">{business.name}</h1>
        <span className="text-xs text-muted">
          {business.gate_mode === "hard_gate" ? "Hard gate" : "Compliant"}
        </span>
      </header>

      {!googleReady ? (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          No Google review link is set, so happy customers have nowhere to go.
          Add google_place_id or google_review_url to this business.
        </p>
      ) : null}

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Requests sent" value={stats?.requests_sent ?? 0} />
        <Stat label="Ratings back" value={stats?.ratings_received ?? 0} />
        <Stat label="Sent to Google" value={stats?.google_clicks ?? 0} />
        <Stat label="Average" value={stats?.avg_rating ?? "-"} />
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Texts waiting for you
        </h2>
        <p className="mt-1 text-xs text-muted">
          These open in your own messaging app and go out from your number.
        </p>
        <div className="mt-4">
          <SmsOutbox rows={outbox} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Unhappy customers
        </h2>
        {feedback && feedback.length > 0 ? (
          <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
            {feedback.map((row) => (
              <li key={row.id} className="p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium">
                    {row.contact_name || "Anonymous"}
                    {row.contact_phone ? `, ${row.contact_phone}` : ""}
                  </p>
                  <span className="shrink-0 text-xs text-muted">
                    {row.rating} of 5
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                  {row.comment || "No comment left."}
                </p>
                <div className="mt-3">
                  <AckButton responseId={row.id} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Nobody waiting on a call back. Good sign.
          </p>
        )}
      </section>

      <section className="mt-10 rounded-xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold">Crew link</h2>
        <p className="mt-1 text-xs text-muted">
          Give this to your technicians and have them save it to their home
          screen. Anyone with the link can log a finished job, and nothing else.
        </p>
        <code className="mt-3 block break-all rounded-lg bg-background p-3 text-xs">
          {staffUrl(business.staff_token)}
        </code>
      </section>
    </main>
  )
}
