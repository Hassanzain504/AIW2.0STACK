"use client"

import { useMemo, useState } from "react"
import { detectHandset, smsHref } from "@/lib/sms/link"

export interface OutboxRow {
  id: string
  to_phone: string | null
  body: string | null
  kind: string
  scheduled_at: string
  contactName: string | null
}

const KIND_LABEL: Record<string, string> = {
  initial: "First text",
  followup_1: "Reminder",
  followup_2: "Last reminder",
}

/**
 * The tap-to-send queue.
 *
 * Each row opens the phone's own messaging app with the number and text
 * already filled in. The owner presses send there, so the message leaves from
 * their real number over their normal plan. No gateway, nothing to register
 * with the carriers, and no per message cost.
 *
 * The trade is that we cannot see whether they actually pressed send, so
 * tapping through is what marks the row done.
 */
export default function SmsOutbox({ rows }: { rows: OutboxRow[] }) {
  const [done, setDone] = useState<Set<string>>(new Set())

  const pending = useMemo(
    () => rows.filter((row) => !done.has(row.id) && row.to_phone && row.body),
    [rows, done]
  )

  async function markSent(id: string) {
    setDone((prev) => new Set(prev).add(id))
    await fetch(`/api/outbox/${id}/sent`, { method: "POST" }).catch(
      () => undefined
    )
  }

  /**
   * iOS and Android disagree on the separator before body in an sms: URL, and
   * the server cannot know which handset will render this. So the anchor holds
   * the Android form and iOS is corrected on the way out. Detecting at click
   * time rather than on mount keeps the markup identical on both sides of
   * hydration.
   */
  function open(row: OutboxRow, event: React.MouseEvent<HTMLAnchorElement>) {
    if (detectHandset(navigator.userAgent) === "ios") {
      event.preventDefault()
      window.location.assign(smsHref(row.to_phone!, row.body!, "ios"))
    }
    markSent(row.id)
  }

  if (pending.length === 0) {
    return (
      <p className="text-sm text-muted">
        No texts waiting. Anything due shows up here.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-border rounded-xl border border-border">
      {pending.map((row) => (
        <li key={row.id} className="p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium">
              {row.contactName || row.to_phone}
            </p>
            <span className="shrink-0 text-xs text-muted">
              {KIND_LABEL[row.kind] ?? row.kind}
            </span>
          </div>
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
            {row.body}
          </p>
          <a
            href={smsHref(row.to_phone!, row.body!, "android")}
            onClick={(event) => open(row, event)}
            className="mt-3 inline-block rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Open and send
          </a>
        </li>
      ))}
    </ul>
  )
}
