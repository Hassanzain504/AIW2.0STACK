import type { Business } from "@/lib/types"
import { googleReviewUrl } from "./links"

export interface ReadinessCheck {
  id: string
  label: string
  ok: boolean
  /** A blocker means the system will not work. A warning means it will limp. */
  severity: "blocker" | "warning"
  hint: string
}

/**
 * What is still missing before this client's review flow actually works.
 *
 * Every failure mode here is silent at runtime. A missing Google link sends
 * happy customers to a dead end, an unverified sending domain makes Resend
 * reject quietly, and an unclaimed owner means the low rating alerts land
 * nowhere. None of them throw, so they have to be surfaced deliberately or a
 * client sits broken for a fortnight before anyone notices.
 */
export function checkReadiness(
  business: Business & { owner_email?: string | null }
): ReadinessCheck[] {
  const checks: ReadinessCheck[] = []

  checks.push({
    id: "google",
    label: "Google review link",
    ok: Boolean(googleReviewUrl(business)),
    severity: "blocker",
    hint: "Without it a five star customer taps through to nothing. Paste the place id or the full write-review URL.",
  })

  checks.push({
    id: "alert",
    label: "Owner alert address",
    ok: Boolean(business.owner_alert_email?.trim()),
    severity: "blocker",
    hint: "Low ratings and the daily text reminder both go here. Nothing reaches the owner without it.",
  })

  checks.push({
    id: "sender",
    label: "Sending address on the client's own domain",
    ok: Boolean(business.from_email?.trim()),
    severity: "warning",
    hint: "Emails fall back to the platform address until this is set and the domain is verified in Resend. They still send, they just look like they came from us.",
  })

  checks.push({
    id: "owner",
    label: "Owner can sign in",
    ok: Boolean(business.owner_user_id) || Boolean(business.owner_email?.trim()),
    severity: "warning",
    hint: "Set the owner's email so the dashboard attaches itself the first time they sign in.",
  })

  checks.push({
    id: "address",
    label: "Postal address in the email footer",
    ok: Boolean(business.postal_address?.trim()),
    severity: "warning",
    hint: "Optional. A review request after a completed job is defensibly transactional, but the address settles any CAN-SPAM argument.",
  })

  return checks
}

export function blockers(checks: ReadinessCheck[]): ReadinessCheck[] {
  return checks.filter((check) => !check.ok && check.severity === "blocker")
}
