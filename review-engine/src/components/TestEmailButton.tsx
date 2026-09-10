"use client"

import { useState } from "react"

/**
 * One real send through the client's configured sender. An unverified Resend
 * domain is the most common silent failure in onboarding, and this is the only
 * thing that catches it before a customer never receives a request.
 */
export default function TestEmailButton({
  businessId,
}: {
  businessId: string
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle"
  )
  const [detail, setDetail] = useState<string | null>(null)

  async function send() {
    setState("sending")
    setDetail(null)
    try {
      const res = await fetch(`/api/admin/businesses/${businessId}/test-email`, {
        method: "POST",
      })
      const data = (await res.json()) as { error?: string; to?: string }
      if (!res.ok) {
        setState("failed")
        setDetail(data.error ?? "Send failed")
        return
      }
      setState("sent")
      setDetail(data.to ? `Sent to ${data.to}` : null)
    } catch {
      setState("failed")
      setDetail("No connection")
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={send}
        disabled={state === "sending"}
        className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-50"
      >
        {state === "sending" ? "Sending" : "Send a test email"}
      </button>
      {detail ? (
        <p
          className={`mt-2 text-xs ${
            state === "failed" ? "text-red-600" : "text-muted"
          }`}
        >
          {detail}
        </p>
      ) : null}
    </div>
  )
}
