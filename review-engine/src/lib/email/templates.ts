import type { Business, CustomerMessageKind } from "@/lib/types"

export interface EmailContent {
  subject: string
  html: string
  text: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function firstName(name: string | null | undefined): string {
  const trimmed = name?.trim()
  if (!trimmed) return "there"
  return trimmed.split(/\s+/)[0]
}

function shell(input: {
  business: Business
  bodyHtml: string
  ctaLabel: string
  ctaUrl: string
  unsubUrl: string
}): string {
  const { business, bodyHtml, ctaLabel, ctaUrl, unsubUrl } = input
  const accent = escapeHtml(business.brand_color || "#111827")
  // CAN-SPAM wants a physical postal address on commercial mail. Rendered only
  // when the business has supplied one.
  const address = business.postal_address?.trim() ?? ""

  return `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e4e4e7;">
    <tr><td style="padding:28px 28px 8px 28px;">
      <p style="margin:0;font-size:15px;font-weight:600;color:${accent};">${escapeHtml(business.name)}</p>
    </td></tr>
    <tr><td style="padding:0 28px 8px 28px;font-size:15px;line-height:1.55;">
      ${bodyHtml}
    </td></tr>
    <tr><td style="padding:16px 28px 28px 28px;">
      <a href="${ctaUrl}" style="display:inline-block;background:${accent};color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:8px;font-size:15px;font-weight:600;">${escapeHtml(ctaLabel)}</a>
    </td></tr>
    <tr><td style="padding:0 28px 24px 28px;font-size:12px;line-height:1.5;color:#71717a;border-top:1px solid #f4f4f5;padding-top:16px;">
      Sent by ${escapeHtml(business.name)}.
      <a href="${unsubUrl}" style="color:#71717a;">Stop these emails</a>.
      ${address ? `<br />${escapeHtml(address)}` : ""}
    </td></tr>
  </table>
</body>
</html>`
}

/**
 * Copy for each step of the chain. The tone stays plain and short. Nobody
 * reads a paragraph from a contractor, and length costs replies.
 */
export function buildCustomerEmail(input: {
  business: Business
  kind: CustomerMessageKind
  contactName: string | null
  serviceType: string | null
  reviewUrl: string
  unsubUrl: string
}): EmailContent {
  const { business, kind, contactName, serviceType, reviewUrl, unsubUrl } = input
  const who = firstName(contactName)
  const work = serviceType?.trim() ? serviceType.trim().toLowerCase() : null

  const copy: Record<
    CustomerMessageKind,
    { subject: string; lines: string[]; cta: string }
  > = {
    initial: {
      subject: `How did we do, ${who}?`,
      lines: [
        `Hi ${who},`,
        work
          ? `Thanks for having us out for ${work}. It takes about ten seconds to tell us how it went.`
          : `Thanks for your business. It takes about ten seconds to tell us how it went.`,
        `Your answer goes straight to the owner.`,
      ],
      cta: "Rate your experience",
    },
    followup_1: {
      subject: `Quick one, ${who}`,
      lines: [
        `Hi ${who},`,
        `Following up on my last note. One tap is all it takes, and it genuinely helps a small business like ours.`,
      ],
      cta: "Rate your experience",
    },
    followup_2: {
      subject: `Last note from ${business.name}`,
      lines: [
        `Hi ${who},`,
        `This is the last time I will ask. If you have ten seconds, we would appreciate it. If not, no problem at all and thanks again for your business.`,
      ],
      cta: "Rate your experience",
    },
  }

  const chosen = copy[kind]
  const bodyHtml = chosen.lines
    .map(
      (line) =>
        `<p style="margin:0 0 12px 0;">${escapeHtml(line)}</p>`
    )
    .join("\n      ")

  const text = [
    ...chosen.lines,
    "",
    reviewUrl,
    "",
    `Stop these emails: ${unsubUrl}`,
    business.postal_address?.trim() ?? "",
  ]
    .filter((line, index, all) => line !== "" || all[index - 1] !== "")
    .join("\n")

  return {
    subject: chosen.subject,
    html: shell({
      business,
      bodyHtml,
      ctaLabel: chosen.cta,
      ctaUrl: reviewUrl,
      unsubUrl,
    }),
    text,
  }
}

/** Straight to the owner the moment someone is unhappy. Speed is the point. */
export function buildOwnerAlertEmail(input: {
  business: Business
  rating: number
  comment: string | null
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  serviceType: string | null
}): EmailContent {
  const {
    business,
    rating,
    comment,
    contactName,
    contactEmail,
    contactPhone,
    serviceType,
  } = input

  const name = contactName?.trim() || "A customer"
  const rows: Array<[string, string]> = [
    ["Rating", `${rating} out of 5`],
    ["Customer", name],
  ]
  if (serviceType?.trim()) rows.push(["Job", serviceType.trim()])
  if (contactEmail) rows.push(["Email", contactEmail])
  if (contactPhone) rows.push(["Phone", contactPhone])

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#71717a;font-size:13px;">${escapeHtml(
          label
        )}</td><td style="padding:4px 0;font-size:13px;font-weight:600;">${escapeHtml(
          value
        )}</td></tr>`
    )
    .join("")

  const commentHtml = comment?.trim()
    ? `<p style="margin:16px 0 0 0;padding:14px;background:#f4f4f5;border-radius:8px;font-size:14px;line-height:1.55;white-space:pre-wrap;">${escapeHtml(
        comment.trim()
      )}</p>`
    : `<p style="margin:16px 0 0 0;color:#71717a;font-size:14px;">They left the rating without a comment.</p>`

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e4e4e7;">
    <tr><td style="padding:28px;">
      <p style="margin:0 0 4px 0;font-size:17px;font-weight:700;">${rating} star rating just came in</p>
      <p style="margin:0 0 18px 0;font-size:14px;color:#71717a;">Call them today. A same day call turns most of these around.</p>
      <table role="presentation" cellpadding="0" cellspacing="0">${rowsHtml}</table>
      ${commentHtml}
    </td></tr>
  </table>
</body>
</html>`

  const text = [
    `${rating} star rating for ${business.name}`,
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    comment?.trim() || "No comment left.",
  ].join("\n")

  return {
    subject: `${rating} star rating from ${name}`,
    html,
    text,
  }
}

/**
 * The daily nudge to the owner.
 *
 * Texts in this system leave from the owner's own handset, so nothing sends
 * until a human taps. Without this email the ready queue quietly grows and the
 * SMS half of the follow-up chain never happens. It is only sent when there is
 * something to act on, so an owner with an empty queue hears nothing.
 */
export function buildOwnerDigestEmail(input: {
  business: Business
  pendingTexts: number
  unreadFeedback: number
  dashboardUrl: string
}): EmailContent {
  const { business, pendingTexts, unreadFeedback, dashboardUrl } = input
  const accent = escapeHtml(business.brand_color || "#111827")

  const textLine =
    pendingTexts === 1
      ? "1 text is waiting to go out."
      : `${pendingTexts} texts are waiting to go out.`

  const feedbackLine =
    unreadFeedback === 1
      ? "1 unhappy customer has not been called back yet."
      : `${unreadFeedback} unhappy customers have not been called back yet.`

  const lines = [textLine]
  if (unreadFeedback > 0) lines.push(feedbackLine)
  lines.push(
    "Open the list, tap each one, and your phone sends it from your own number."
  )

  const bodyHtml = lines
    .map((line) => `<p style="margin:0 0 12px 0;">${escapeHtml(line)}</p>`)
    .join("\n      ")

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e4e4e7;">
    <tr><td style="padding:28px 28px 8px 28px;">
      <p style="margin:0;font-size:17px;font-weight:700;">Review requests need you</p>
    </td></tr>
    <tr><td style="padding:0 28px 8px 28px;font-size:15px;line-height:1.55;">
      ${bodyHtml}
    </td></tr>
    <tr><td style="padding:16px 28px 28px 28px;">
      <a href="${dashboardUrl}" style="display:inline-block;background:${accent};color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:8px;font-size:15px;font-weight:600;">Open the list</a>
    </td></tr>
  </table>
</body>
</html>`

  return {
    subject:
      pendingTexts === 1
        ? "1 review text waiting"
        : `${pendingTexts} review texts waiting`,
    html,
    text: [...lines, "", dashboardUrl].join("\n"),
  }
}
