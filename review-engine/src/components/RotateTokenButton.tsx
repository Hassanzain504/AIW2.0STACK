"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

/**
 * Issues a new crew link. The old one stops working immediately, which is the
 * point, so this asks once before doing it.
 */
export default function RotateTokenButton({
  businessId,
}: {
  businessId: string
}) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function rotate() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/businesses/${businessId}/rotate-staff-token`,
        { method: "POST" }
      )
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setError(data.error ?? "Could not issue a new link.")
        return
      }
      setConfirming(false)
      router.refresh()
    } catch {
      setError("No connection. Try again.")
    } finally {
      setBusy(false)
    }
  }

  if (!confirming) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium"
        >
          Issue a new crew link
        </button>
        {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-3">
      <p className="text-sm text-red-900">
        The current crew link stops working straight away. Every technician
        needs the new one before they can log another job.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={rotate}
          disabled={busy}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Working" : "Do it"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
