import { APP_URL } from "@/lib/supabase/env"
import type { Business } from "@/lib/types"

/** The link the end customer taps. Short on purpose, it goes into an SMS. */
export function reviewUrl(token: string): string {
  return `${APP_URL}/r/${token}`
}

/** The QR target. Mints a fresh request on scan, then redirects to /r/{token}. */
export function qrTargetUrl(business: Pick<Business, "slug">): string {
  return `${APP_URL}/j/${business.slug}`
}

/** The technician's quick-add screen. Holding this link is the only credential. */
export function staffUrl(staffToken: string): string {
  return `${APP_URL}/s/${staffToken}`
}

export function unsubscribeUrl(token: string): string {
  return `${APP_URL}/unsubscribe/${token}`
}

/**
 * Where a happy customer lands. Prefer an explicit URL if the business set one,
 * otherwise build Google's write-review deep link from the place id.
 *
 * Returns null when neither is configured, which the caller must handle rather
 * than sending the customer to a dead end.
 */
export function googleReviewUrl(
  business: Pick<Business, "google_review_url" | "google_place_id">
): string | null {
  if (business.google_review_url) return business.google_review_url
  if (business.google_place_id) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(
      business.google_place_id
    )}`
  }
  return null
}

/** True once a request is past its window. Kept out of component bodies. */
export function hasExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() < Date.now()
}
