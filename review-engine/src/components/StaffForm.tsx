"use client"

import { useState } from "react"
import QRCode from "qrcode"

interface Props {
  staffToken: string
  businessName: string
  brandColor: string
  walkUpQr: string
  walkUpUrl: string
}

/**
 * The technician's screen. One form, used at the door with the customer
 * standing there.
 *
 * It does two jobs at once. Saving the customer's details starts the email
 * chain, which is what makes a follow-up possible at all. The QR that appears
 * afterwards points at that same request, so if the customer scans it on the
 * spot the rating still lands against the right job.
 */
export default function StaffForm({
  staffToken,
  businessName,
  brandColor,
  walkUpQr,
  walkUpUrl,
}: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [techName, setTechName] = useState("")

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ url: string; qr: string } | null>(null)

  async function submit() {
    if (!email.trim() && !phone.trim()) {
      setError("Add an email or a phone number so we can follow up.")
      return
    }
    setSaving(true)
    setError(null)

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffToken,
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          serviceType: serviceType.trim() || undefined,
          techName: techName.trim() || undefined,
        }),
      })
      const data = (await res.json()) as { error?: string; url?: string }

      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not save that. Please try again.")
        return
      }

      const qr = await QRCode.toDataURL(data.url, { margin: 1, width: 480 })
      setDone({ url: data.url, qr })
    } catch {
      setError("No connection. Try again once you have signal.")
    } finally {
      setSaving(false)
    }
  }

  function reset() {
    setName("")
    setEmail("")
    setPhone("")
    setServiceType("")
    setDone(null)
    setError(null)
  }

  if (done) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-semibold tracking-tight">Saved</h1>
        <p className="mt-2 text-sm text-muted">
          The first email is on its way. Reminders follow on day 3 and day 7
          unless they answer first.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Or let them scan it now
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={done.qr}
            alt="Scan to leave a review"
            className="mx-auto mt-3 h-56 w-56"
          />
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-6 w-full rounded-lg px-6 py-4 text-base font-semibold text-white"
          style={{ backgroundColor: brandColor }}
        >
          Log another job
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Job finished</h1>
      <p className="mt-1 text-sm text-muted">{businessName}</p>

      <label className="mt-6 block text-sm font-medium" htmlFor="cust-name">
        Customer name
      </label>
      <input
        id="cust-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="off"
        className="mt-2 w-full rounded-lg border border-border p-3 text-base outline-none focus:border-zinc-400"
      />

      <label className="mt-4 block text-sm font-medium" htmlFor="cust-email">
        Email
      </label>
      <input
        id="cust-email"
        type="email"
        inputMode="email"
        autoCapitalize="off"
        autoCorrect="off"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-2 w-full rounded-lg border border-border p-3 text-base outline-none focus:border-zinc-400"
      />

      <label className="mt-4 block text-sm font-medium" htmlFor="cust-phone">
        Mobile number
      </label>
      <input
        id="cust-phone"
        type="tel"
        inputMode="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mt-2 w-full rounded-lg border border-border p-3 text-base outline-none focus:border-zinc-400"
      />
      <p className="mt-1 text-xs text-muted">
        One of email or mobile is enough. Both is better.
      </p>

      <label className="mt-4 block text-sm font-medium" htmlFor="service">
        What was the job?
      </label>
      <input
        id="service"
        value={serviceType}
        onChange={(e) => setServiceType(e.target.value)}
        placeholder="Roof replacement"
        className="mt-2 w-full rounded-lg border border-border p-3 text-base outline-none focus:border-zinc-400"
      />

      <label className="mt-4 block text-sm font-medium" htmlFor="tech">
        Your name
      </label>
      <input
        id="tech"
        value={techName}
        onChange={(e) => setTechName(e.target.value)}
        className="mt-2 w-full rounded-lg border border-border p-3 text-base outline-none focus:border-zinc-400"
      />

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="mt-6 w-full rounded-lg px-6 py-4 text-base font-semibold text-white disabled:opacity-50"
        style={{ backgroundColor: brandColor }}
      >
        {saving ? "Saving" : "Send review request"}
      </button>

      <details className="mt-8 rounded-xl border border-border bg-surface p-4">
        <summary className="cursor-pointer text-sm font-medium">
          Walk-up QR code
        </summary>
        <p className="mt-2 text-xs text-muted">
          Print this for the van or the invoice. Anyone can scan it, but nobody
          who scans it gets a reminder, because we never learn how to reach
          them.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={walkUpQr}
          alt="Walk-up review QR code"
          className="mx-auto mt-3 h-48 w-48"
        />
        <p className="mt-2 break-all text-center text-xs text-muted">
          {walkUpUrl}
        </p>
      </details>
    </div>
  )
}
