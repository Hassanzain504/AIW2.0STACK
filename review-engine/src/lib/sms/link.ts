export type Handset = "ios" | "android" | "other"

export function detectHandset(userAgent: string): Handset {
  const ua = userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(ua)) return "ios"
  if (/android/.test(ua)) return "android"
  return "other"
}

/** Strip everything a dialler does not want. */
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "")
  if (digits.startsWith("+")) return "+" + digits.slice(1).replace(/\D/g, "")
  // US and Canada default. Ten digits get a country code, eleven starting with
  // a 1 get a plus.
  const bare = digits.replace(/\D/g, "")
  if (bare.length === 10) return `+1${bare}`
  if (bare.length === 11 && bare.startsWith("1")) return `+${bare}`
  return bare ? `+${bare}` : ""
}

/**
 * Build the sms: URL that opens the sender's own messaging app with the number
 * and text already filled in. They press send, and the message leaves from
 * their real number.
 *
 * This is how the system sends SMS in the United States without A2P 10DLC
 * registration. No gateway is involved, so there is nothing to register, no
 * per message cost, and the customer sees a local number they recognise. The
 * trade is that each send needs one human tap.
 *
 * iOS and Android disagree on the separator before body, hence the split.
 */
export function smsHref(
  phone: string,
  body: string,
  handset: Handset
): string {
  const to = normalisePhone(phone)
  const encoded = encodeURIComponent(body)
  const separator = handset === "ios" ? "&" : "?"
  return `sms:${to}${separator}body=${encoded}`
}

/** Same idea for WhatsApp, also with no business API to register. */
export function whatsappHref(phone: string, body: string): string {
  const digits = normalisePhone(phone).replace(/\D/g, "")
  return `https://wa.me/${digits}?text=${encodeURIComponent(body)}`
}
