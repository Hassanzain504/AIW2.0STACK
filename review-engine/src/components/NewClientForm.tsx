"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { slugify } from "@/lib/admin"

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

const inputClass =
  "w-full rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-zinc-400"

export default function NewClientForm({ appUrl }: { appUrl: string }) {
  const router = useRouter()

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [google, setGoogle] = useState("")
  const [ownerAlertEmail, setOwnerAlertEmail] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [fromEmail, setFromEmail] = useState("")
  const [replyToEmail, setReplyToEmail] = useState("")
  const [postalAddress, setPostalAddress] = useState("")
  const [brandColor, setBrandColor] = useState("#111827")
  const [timezone, setTimezone] = useState("America/New_York")
  const [gateMode, setGateMode] = useState<"hard_gate" | "compliant">("hard_gate")
  const [followup1Days, setFollowup1Days] = useState(3)
  const [followup2Days, setFollowup2Days] = useState(7)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // The slug follows the name until the operator edits it, then it stops
  // fighting them.
  const effectiveSlug = slugTouched ? slugify(slug) : slugify(name)

  async function submit() {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch("/api/admin/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: effectiveSlug,
          google,
          ownerAlertEmail,
          ownerEmail,
          fromEmail,
          replyToEmail,
          postalAddress,
          brandColor,
          timezone,
          gateMode,
          followup1Days,
          followup2Days,
        }),
      })
      const data = (await res.json()) as { error?: string; id?: string }

      if (!res.ok || !data.id) {
        setError(data.error ?? "Could not save. Check the form.")
        return
      }
      router.push(`/admin/${data.id}`)
    } catch {
      setError("No connection. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const canSubmit =
    name.trim().length > 1 &&
    ownerAlertEmail.includes("@") &&
    effectiveSlug.length > 0

  return (
    <div>
      <Field label="Business name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Apex Roofing"
          className={inputClass}
        />
      </Field>

      <Field
        label="Link name"
        hint={`Their QR points at ${appUrl}/j/${effectiveSlug || "..."}`}
      >
        <input
          value={slugTouched ? slug : effectiveSlug}
          onChange={(e) => {
            setSlugTouched(true)
            setSlug(e.target.value)
          }}
          className={inputClass}
        />
      </Field>

      <Field
        label="Google review link or place ID"
        hint="Paste either. Without it a five star customer taps through to nothing."
      >
        <input
          value={google}
          onChange={(e) => setGoogle(e.target.value)}
          placeholder="ChIJ... or https://search.google.com/local/writereview?placeid=..."
          className={inputClass}
        />
      </Field>

      <Field
        label="Owner alert email"
        hint="Low ratings and the daily text reminder both land here. Required."
      >
        <input
          type="email"
          value={ownerAlertEmail}
          onChange={(e) => setOwnerAlertEmail(e.target.value)}
          placeholder="owner@apexroofing.com"
          className={inputClass}
        />
      </Field>

      <Field
        label="Owner sign-in email"
        hint="The dashboard attaches itself the first time they sign in with this address. Leave blank to use the alert address."
      >
        <input
          type="email"
          value={ownerEmail}
          onChange={(e) => setOwnerEmail(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field
        label="Send from"
        hint="Must be on a domain verified in Resend. Leave blank and emails go from the platform address instead."
      >
        <input
          type="email"
          value={fromEmail}
          onChange={(e) => setFromEmail(e.target.value)}
          placeholder="reviews@apexroofing.com"
          className={inputClass}
        />
      </Field>

      <details className="mt-8 rounded-xl border border-border bg-surface p-4">
        <summary className="cursor-pointer text-sm font-medium">
          Everything else
        </summary>

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
          hint="Shown in the email footer. Optional, settles any CAN-SPAM argument."
        >
          <input
            value={postalAddress}
            onChange={(e) => setPostalAddress(e.target.value)}
            placeholder="1200 Main St, Baton Rouge, LA 70802"
            className={inputClass}
          />
        </Field>

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

        <Field
          label="Rating routing"
          hint="Hard gate sends only 4 and 5 star customers to Google. Google's policy and the FTC's 2024 rule both treat that as suppression, so compliant mode shows everyone the public link and puts recovery first for low ratings."
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

        <div className="mt-4 grid grid-cols-2 gap-3">
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
      </details>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        onClick={submit}
        disabled={saving || !canSubmit}
        className="mt-6 w-full rounded-lg bg-zinc-900 px-6 py-3.5 text-base font-semibold text-white disabled:opacity-50"
      >
        {saving ? "Creating" : "Create client"}
      </button>
    </div>
  )
}
