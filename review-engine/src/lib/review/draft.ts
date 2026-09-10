/**
 * A starter sentence the happy customer can copy into Google.
 *
 * Most people abandon a review because of the blank box, not because they are
 * unwilling. Offering wording removes that. It stays a suggestion: the text is
 * copied to their clipboard and they edit or ignore it. Google cannot be
 * pre-filled through the URL, so a copy button is the only honest option.
 */
export function draftReview(input: {
  businessName: string
  serviceType?: string | null
  techName?: string | null
  rating: number
}): string {
  const { businessName, serviceType, techName, rating } = input

  const work = serviceType?.trim()
    ? serviceType.trim().toLowerCase()
    : "the work"

  const opener =
    rating === 5
      ? `${businessName} did a great job with ${work}.`
      : `Good experience with ${businessName} on ${work}.`

  const person = techName?.trim()
    ? ` ${techName.trim()} showed up when they said they would and kept me in the loop.`
    : ` They showed up when they said they would and kept me in the loop.`

  const closer = " Clear pricing, tidy finish. Happy to recommend them."

  return opener + person + closer
}
