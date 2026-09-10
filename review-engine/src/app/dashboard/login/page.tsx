"use client"

import { useState } from "react"
import { createBrowserSupabase } from "@/lib/supabase/browser"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit() {
    if (!email.trim()) return
    setBusy(true)
    setError(null)

    const supabase = createBrowserSupabase()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="mt-2 text-sm text-muted">
          We sent a sign-in link to {email}. It works once and expires in an
          hour.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <p className="mt-1 text-sm text-muted">
        No password. We email you a link.
      </p>

      <input
        type="email"
        inputMode="email"
        autoCapitalize="off"
        autoCorrect="off"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@yourbusiness.com"
        className="mt-6 w-full rounded-lg border border-border p-3 text-base outline-none focus:border-zinc-400"
      />

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="mt-4 w-full rounded-lg bg-zinc-900 px-6 py-3.5 text-base font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Sending" : "Email me a link"}
      </button>
    </main>
  )
}
