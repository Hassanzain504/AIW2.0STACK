"use client"

import { useState } from "react"

/** A read-only link with a copy button. The links here are long and get pasted
 *  into texts and print jobs, so retyping them is not an option. */
export default function CopyField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be refused. The value is on screen regardless.
    }
  }

  return (
    <div className="mt-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <div className="mt-1.5 flex items-start gap-2">
        <code className="min-w-0 flex-1 break-all rounded-lg bg-surface p-2.5 text-xs">
          {value}
        </code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-medium"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  )
}
