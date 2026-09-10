import type { GateMode, ResponseRoute } from "@/lib/types"

export interface GateDecision {
  route: ResponseRoute
  /** Show the Google link on this screen. */
  showGoogle: boolean
  /** Ask for private feedback before anything else. */
  askForFeedback: boolean
}

/**
 * Where a rating sends the customer.
 *
 * hard_gate: 4 and 5 go straight to Google, 1 to 3 only ever see the private
 * form. This is what the business asked for. Be aware that Google's prohibited
 * content policy and the FTC's 2024 rule on consumer reviews both treat
 * suppressing negative reviews as a violation, so the profile carries some
 * risk under this mode.
 *
 * compliant: every rating can reach Google. Low ratings are shown the recovery
 * form first, and the public link afterwards, which is not suppression.
 *
 * Both modes are supported so a business can be switched with a single column
 * update rather than a rewrite.
 */
export function decideRoute(rating: number, mode: GateMode): GateDecision {
  const happy = rating >= 4

  if (happy) {
    return { route: "google", showGoogle: true, askForFeedback: false }
  }

  if (mode === "compliant") {
    return { route: "private", showGoogle: true, askForFeedback: true }
  }

  return { route: "private", showGoogle: false, askForFeedback: true }
}
