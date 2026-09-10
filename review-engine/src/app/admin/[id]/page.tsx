import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import QRCode from "qrcode"
import { getAdminSession } from "@/lib/admin-session"
import { getBusinessById } from "@/lib/review/business"
import { qrTargetUrl, staffUrl } from "@/lib/review/links"
import { checkReadiness, blockers } from "@/lib/review/readiness"
import CopyField from "@/components/CopyField"
import TestEmailButton from "@/components/TestEmailButton"

export const dynamic = "force-dynamic"

export default async function ClientSetupPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const admin = await getAdminSession()
  if (!admin) redirect("/admin")

  const { id } = await params
  const business = await getBusinessById(id)
  if (!business) notFound()

  const checks = checkReadiness(business)
  const outstanding = blockers(checks)

  const walkUpUrl = qrTargetUrl(business)
  const walkUpQr = await QRCode.toDataURL(walkUpUrl, { margin: 1, width: 600 })

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <Link href="/admin" className="text-sm text-muted underline">
        All clients
      </Link>

      <h1 className="mt-4 text-xl font-semibold">{business.name}</h1>
      <p className="mt-1 text-sm text-muted">
        {business.gate_mode === "hard_gate" ? "Hard gate" : "Compliant"},{" "}
        reminders on day {business.followup_1_days} and day{" "}
        {business.followup_2_days}
      </p>

      {outstanding.length > 0 ? (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          This client is not live yet. {outstanding.length} thing
          {outstanding.length === 1 ? "" : "s"} below will stop it working.
        </p>
      ) : (
        <p className="mt-6 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
          Nothing is blocking this client. Hand over the crew link and they can
          start today.
        </p>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Setup
        </h2>
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
          {checks.map((check) => (
            <li key={check.id} className="p-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium">{check.label}</p>
                <span
                  className={`shrink-0 text-xs font-medium ${
                    check.ok
                      ? "text-emerald-700"
                      : check.severity === "blocker"
                        ? "text-red-600"
                        : "text-amber-700"
                  }`}
                >
                  {check.ok
                    ? "Done"
                    : check.severity === "blocker"
                      ? "Blocking"
                      : "Worth doing"}
                </span>
              </div>
              {!check.ok ? (
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {check.hint}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">
          Anything missing is still changed in the database for now. The
          settings screen is not built yet.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Check the sending works
        </h2>
        <p className="mt-1 text-xs text-muted">
          Goes to {business.owner_alert_email || admin.email} through this
          client&apos;s own sender. If it does not arrive, the domain is not
          verified in Resend yet.
        </p>
        <div className="mt-4">
          <TestEmailButton businessId={business.id} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Hand these over
        </h2>

        <CopyField
          label="Crew link, for the technicians"
          value={staffUrl(business.staff_token)}
        />
        <p className="mt-1.5 text-xs text-muted">
          Anyone holding this can log a finished job and nothing else. Tell them
          to save it to their home screen.
        </p>

        <CopyField label="Walk-up QR link" value={walkUpUrl} />

        <div className="mt-4 rounded-xl border border-border bg-surface p-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={walkUpQr}
            alt={`Review QR code for ${business.name}`}
            className="mx-auto h-56 w-56"
          />
          <p className="mt-3 text-xs text-muted">
            Print for the van or the invoice. Scans convert well because the
            customer is standing there, but they carry no contact, so nobody who
            scans this gets a reminder.
          </p>
        </div>
      </section>
    </main>
  )
}
