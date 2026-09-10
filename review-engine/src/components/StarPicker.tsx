"use client"

import { useState } from "react"

type Stage = "rating" | "submitting" | "google" | "feedback" | "done" | "error"

interface RateResponse {
  ok?: boolean
  error?: string
  route?: "google" | "private"
  showGoogle?: boolean
  askForFeedback?: boolean
  googleUrl?: string | null
  draft?: string | null
}

export interface StarPickerProps {
  token: string
  businessName: string
  brandColor: string
  /** Shown once the customer has been routed to Google in compliant mode. */
  googleFallbackLabel?: string
}

function Star({
  index,
  active,
  color,
  onSelect,
  onHover,
}: {
  index: number
  active: boolean
  color: string
  onSelect: () => void
  onHover: (index: number | null) => void
}) {
  return (
    <button
      type="button"
      aria-label={`${index} out of 5`}
      onClick={onSelect}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className="star-button p-1 text-5xl leading-none sm:text-6xl"
      style={{ color: active ? color : "#d4d4d8" }}
    >
      <span aria-hidden>&#9733;</span>
    </button>
  )
}

export default function StarPicker({
  token,
  businessName,
  brandColor,
}: StarPickerProps) {
  const [stage, setStage] = useState<Stage>("rating")
  const [hovered, setHovered] = useState<number | null>(null)
  const [rating, setRating] = useState<number | null>(null)
  const [result, setResult] = useState<RateResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [comment, setComment] = useState("")
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [sending, setSending] = useState(false)

  async function submitRating(value: number) {
    setRating(value)
    setStage("submitting")
    setError(null)

    try {
      const res = await fetch("/api/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, rating: value }),
      })
      const data = (await res.json()) as RateResponse

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        setStage("error")
        return
      }

      setResult(data)

      // A happy customer with a working Google link goes straight there. Every
      // extra screen between the tap and the review box loses people.
      if (data.route === "google" && data.googleUrl) {
        setStage("google")
        return
      }
      setStage("feedback")
    } catch {
      setError("We could not reach the server. Please try again.")
      setStage("error")
    }
  }

  async function submitFeedback() {
    if (!comment.trim()) return
    setSending(true)
    setError(null)

    const looksLikeEmail = contact.includes("@")
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          comment: comment.trim(),
          name: name.trim() || undefined,
          email: looksLikeEmail ? contact.trim() : undefined,
          phone: !looksLikeEmail && contact.trim() ? contact.trim() : undefined,
        }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        setSending(false)
        return
      }
      setStage("done")
    } catch {
      setError("We could not reach the server. Please try again.")
    } finally {
      setSending(false)
    }
  }

  async function copyDraft() {
    if (!result?.draft) return
    try {
      await navigator.clipboard.writeText(result.draft)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard access can be refused. The text is on screen either way.
    }
  }

  // ---------------------------------------------------------------- rating --
  if (stage === "rating" || stage === "submitting") {
    const shown = hovered ?? rating ?? 0
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          How did we do?
        </h1>
        <p className="mt-2 text-sm text-muted">
          One tap. It takes about ten seconds.
        </p>

        <div className="mt-8 flex justify-center" onMouseLeave={() => setHovered(null)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              index={value}
              active={value <= shown}
              color={brandColor}
              onSelect={() => stage === "rating" && submitRating(value)}
              onHover={setHovered}
            />
          ))}
        </div>

        <p className="mt-6 h-5 text-sm text-muted">
          {stage === "submitting" ? "Saving your rating." : ""}
        </p>
      </div>
    )
  }

  // ---------------------------------------------------------------- google --
  if (stage === "google" && result?.googleUrl) {
    return (
      <div className="text-center">
        <p className="text-4xl" aria-hidden>
          &#9733;&#9733;&#9733;&#9733;&#9733;
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Thank you
        </h1>
        <p className="mt-2 text-sm text-muted">
          Would you post that on Google? It is the single biggest help you can
          give {businessName}.
        </p>

        <a
          href={`/r/${token}/go`}
          className="mt-6 block w-full rounded-lg px-6 py-4 text-base font-semibold text-white"
          style={{ backgroundColor: brandColor }}
        >
          Write a Google review
        </a>

        {result.draft ? (
          <div className="mt-8 rounded-lg border border-border bg-surface p-4 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Stuck for words? Use this
            </p>
            <p className="mt-2 text-sm leading-relaxed">{result.draft}</p>
            <button
              type="button"
              onClick={copyDraft}
              className="mt-3 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium"
            >
              {copied ? "Copied" : "Copy this text"}
            </button>
          </div>
        ) : null}
      </div>
    )
  }

  // -------------------------------------------------------------- feedback --
  if (stage === "feedback") {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Sorry we missed the mark
        </h1>
        <p className="mt-2 text-sm text-muted">
          Tell {businessName} what went wrong. This goes straight to the owner,
          not to a public page, and they will get it within a minute.
        </p>

        <label className="mt-6 block text-sm font-medium" htmlFor="comment">
          What happened?
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          className="mt-2 w-full rounded-lg border border-border bg-background p-3 text-base outline-none focus:border-zinc-400"
          placeholder="A sentence or two is plenty."
        />

        <label className="mt-4 block text-sm font-medium" htmlFor="name">
          Your name (optional)
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-background p-3 text-base outline-none focus:border-zinc-400"
        />

        <label className="mt-4 block text-sm font-medium" htmlFor="contact">
          Email or phone, if you want a call back (optional)
        </label>
        <input
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-background p-3 text-base outline-none focus:border-zinc-400"
        />

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <button
          type="button"
          onClick={submitFeedback}
          disabled={sending || !comment.trim()}
          className="mt-6 w-full rounded-lg px-6 py-4 text-base font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: brandColor }}
        >
          {sending ? "Sending" : "Send to the owner"}
        </button>

        {/*
          In compliant mode the public link stays available to everyone, which
          is what keeps the flow inside Google's policy. In hard gate mode the
          server never returns a URL here, so nothing renders.
        */}
        {result?.showGoogle && result.googleUrl ? (
          <a
            href={`/r/${token}/go`}
            className="mt-4 block text-center text-sm text-muted underline"
          >
            Or post this publicly on Google
          </a>
        ) : null}
      </div>
    )
  }

  // ------------------------------------------------------------------ done --
  if (stage === "done") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Thank you</h1>
        <p className="mt-2 text-sm text-muted">
          That is with the owner now. Someone will be in touch.
        </p>
        {result?.showGoogle && result.googleUrl ? (
          <a
            href={`/r/${token}/go`}
            className="mt-6 block text-sm text-muted underline"
          >
            Post this publicly on Google
          </a>
        ) : null}
      </div>
    )
  }

  // ----------------------------------------------------------------- error --
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-muted">{error}</p>
      <button
        type="button"
        onClick={() => setStage("rating")}
        className="mt-6 rounded-lg border border-border px-5 py-3 text-sm font-medium"
      >
        Try again
      </button>
    </div>
  )
}
