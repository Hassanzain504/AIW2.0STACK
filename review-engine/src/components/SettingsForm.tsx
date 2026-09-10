"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Business } from "@/lib/types"
import TestEmailButton from "./TestEmailButton"

const inputClass =
  "w-full rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-zinc-400"

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium">{label}</label>
      {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

export default function SettingsForm({
  business,
  role,
  appUrl,
}: {
  business: Business
  role: "admin" | "owner"
  appUrl: string
}) {
  const router = useRouter()
  const isAdmin = role === "admin"

  const [name, setName] = useState(business.name)
  const [google, setGoogle] = useState(
    business.google_review_url || business.google_place_id || ""
  )
  const [ownerAlertEmail, setOwnerAlertEmail] = useState(
    business.owner_alert_email ?? ""
  )
  const [fromName, setFromName] = useState(business.from_name ?? "")
  const [fromEmail, setFromEmail] = useState(business.from_email ?? "")
  const [replyToEmail, setReplyToEmail] = useState(business.reply_to_email ?? "")
  const [postalAddress, setPostalAddress] = useState(
    business.postal_address ?? ""
  )
  const [logoUrl, setLogoUrl] = useState(business.logo_url ?? "")
  const [brandColor, setBrandColor] = useState(business.brand_color)
  const [timezone, setTimezone] = useState(business.timezone)
  const [followup1Days, setFollowup1Days] = useState(business.followup_1_days)
  const [followup2Days, setFollowup2Days] = useState(business.followup_2_days)

  const [slug, setSlug] = useState(business.slug)
  const [gateMode, setGateMode] = useState(business.gate_mode)
  const [ownerEmail, setOwnerEmail] = useState(business.owner_email ?? "")
  const [active, setActive] = useState(business.active)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const slugChanged = isAdmin && slug !== business.slug

  async function save() {
    setSaving(true)
    setError(null)
    setSaved(false)

    const body: Record<string, unknown> = {
      name,
      google,
      ownerAlertEmail,
      fromName,
      fromEmail,
      replyToEmail,
      postalAddress,
      logoUrl,
      brandColor,
      timezone,
      followup1Days,
      followup2Days,
    }

    if (isAdmin) {
      body.slug = slug
      body.gateMode = gateMode
      body.ownerEmail = ownerEmail
      body.active = active
    }

    try {
      const res = await fetch(`/api/businesses/${business.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Could not save.")
        return
      }
      setSaved(true)
      router.refresh()
    } catch {
      setError("No connection. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Field label="Business name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field
        label="Google review link or place ID"
        hint="Paste either. Clear it and happy customers have nowhere to go, so leave it set."
      >
        <input
          value={google}
          onChange={(e) => setGoogle(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field
        label="Owner alert email"
        hint="Low ratings and the daily text reminder both land here."
      >
        <input
          type="email"
          value={ownerAlertEmail}
          onChange={(e) => setOwnerAlertEmail(e.target.value)}
          className={inputClass}
        />
      </Field>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Sending
        </h2>

        <Field
          label="Send from"
          hint="Must be on a domain verified in Resend. Change this and send a test before you walk away, because an unverified domain fails silently."
        >
          <input
            type="email"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Sender name">
          <input
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Reply-to address">
          <input
            type="email"
            value={replyToEmail}
            onChange={(e) => setReplyToEmail(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field
          label="Postal address"
          hint="Shown in the email footer."
        >
          <input
            value={postalAddress}
            onChange={(e) => setPostalAddress(e.target.value)}
            className={inputClass}
          />
        </Field>

        <div className="mt-5">
          <TestEmailButton businessId={business.id} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Chasing
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="First reminder, days">
            <input
              type="number"
              min={1}
              max={60}
              value={followup1Days}
              onChange={(e) => setFollowup1Days(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Last reminder, days">
            <input
              type="number"
              min={1}
              max={120}
              value={followup2Days}
              onChange={(e) => setFollowup2Days(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </div>
        <p className="mt-2 text-xs text-muted">
          Only affects jobs logged from now on. Requests already in flight keep
          the schedule they were created with.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Look
        </h2>

        <Field label="Brand colour">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="h-10 w-14 rounded border border-border"
            />
            <input
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className={inputClass}
            />
          </div>
        </Field>

        <Field label="Logo URL" hint="Shown above the stars. Optional.">
          <input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Timezone">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className={inputClass}
          >
            <option value="America/New_York">Eastern</option>
            <option value="America/Chicago">Central</option>
            <option value="America/Denver">Mountain</option>
            <option value="America/Phoenix">Arizona</option>
            <option value="America/Los_Angeles">Pacific</option>
          </select>
        </Field>
      </section>

      {isAdmin ? (
        <section className="mt-10 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-900">
            Yours only
          </h2>
          <p className="mt-1 text-xs text-amber-900">
            The client does not see these on their own settings page.
          </p>

          <Field
            label="Link name"
            hint={`Their QR points at ${appUrl}/j/${slug}`}
          >
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputClass}
            />
          </Field>

          {slugChanged ? (
            <p className="mt-2 rounded-lg border border-red-300 bg-red-50 p-2.5 text-xs text-red-900">
              Changing this kills every QR code already printed. Anything on a
              van or an invoice stops working the moment you save.
            </p>
          ) : null}

          <Field
            label="Rating routing"
            hint="Hard gate shows the Google link only to 4 and 5 star customers. Google's policy and the FTC's 2024 rule both treat that as suppression, so compliant mode shows everyone the link and puts recovery first for low ratings."
          >
            <select
              value={gateMode}
              onChange={(e) =>
                setGateMode(e.target.value as "hard_gate" | "compliant")
              }
              className={inputClass}
            >
              <option value="hard_gate">Hard gate</option>
              <option value="compliant">Compliant</option>
            </select>
          </Field>

          <Field
            label="Owner sign-in email"
            hint="Whoever signs in with this address claims the dashboard."
          >
            <input
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className={inputClass}
            />
          </Field>

          <div className="mt-4 flex items-center gap-2">
            <input
              id="active"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="active" className="text-sm font-medium">
              Client is live
            </label>
          </div>
          <p className="mt-1 text-xs text-amber-900">
            Turning this off stops the crew link, the QR codes, and every
            review page for this client.
          </p>
        </section>
      ) : null}

      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="mt-6 text-sm text-emerald-700">Saved.</p> : null}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-6 w-full rounded-lg bg-zinc-900 px-6 py-3.5 text-base font-semibold text-white disabled:opacity-50"
      >
        {saving ? "Saving" : "Save settings"}
      </button>
    </div>
  )
}
