import type { MessageKind } from "@/lib/types"

/**
 * SMS bodies stay under 320 characters, which is two segments. Segment count
 * does not cost anything here because the message leaves from a human's own
 * phone, but long texts still read badly and get ignored.
 */
export function buildSmsBody(input: {
  businessName: string
  contactName: string | null
  serviceType: string | null
  reviewUrl: string
  kind: Exclude<MessageKind, "low_rating_alert">
}): string {
  const { businessName, contactName, serviceType, reviewUrl, kind } = input
  const who = contactName?.trim()?.split(/\s+/)[0]
  const greeting = who ? `Hi ${who}, ` : "Hi, "
  const work = serviceType?.trim() ? serviceType.trim().toLowerCase() : null

  if (kind === "initial") {
    return (
      `${greeting}this is ${businessName}. Thanks for ` +
      (work ? `letting us handle ${work}. ` : "your business. ") +
      `Would you mind rating us? Takes ten seconds: ${reviewUrl} Reply STOP to opt out.`
    )
  }

  if (kind === "followup_1") {
    return (
      `${greeting}${businessName} again. Just a nudge on that quick rating, ` +
      `it really helps us: ${reviewUrl} Reply STOP to opt out.`
    )
  }

  return (
    `${greeting}last nudge from ${businessName}. If you have ten seconds: ` +
    `${reviewUrl} Either way, thanks for your business. Reply STOP to opt out.`
  )
}
