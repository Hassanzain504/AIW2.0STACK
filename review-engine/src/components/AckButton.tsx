"use client"

import { useState } from "react"

/**
 * Clears one unhappy customer off the owner's list once they have called them.
 * Optimistic, because the only failure worth surfacing is a lost session and
 * the row reappears on the next load anyway.
 */
export default function AckButton({ responseId }: { responseId: string }) {
  const [done, setDone] = useState(false)

  async function acknowledge() {
    setDone(true)
    await fetch(`/api/responses/${responseId}/ack`, { method: "POST" }).catch(
      () => undefined
    )
  }

  if (done) {
    return <span className="text-xs text-muted">Marked as handled</span>
  }

  return (
    <button
      type="button"
      onClick={acknowledge}
      className="rounded-md border border-border px-3 py-1.5 text-xs font-medium"
    >
      I have called them
    </button>
  )
}
