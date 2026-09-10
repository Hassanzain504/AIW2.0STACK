import { Resend } from "resend"
import {
  DEFAULT_FROM_EMAIL,
  DEFAULT_FROM_NAME,
  RESEND_API_KEY,
  isResendConfigured,
} from "@/lib/supabase/env"
import type { Business } from "@/lib/types"
import type { EmailContent } from "./templates"

export interface SendResult {
  ok: boolean
  providerId?: string
  error?: string
}

let client: Resend | null = null

function resend(): Resend {
  if (!client) client = new Resend(RESEND_API_KEY)
  return client
}

/**
 * Every business sends from its own verified domain where one is configured,
 * so the customer sees the contractor's name in the inbox rather than ours.
 * Falls back to the platform sender until the client's DNS records are live.
 */
function fromHeader(business: Business): string {
  const email = business.from_email?.trim() || DEFAULT_FROM_EMAIL
  const name = business.from_name?.trim() || business.name || DEFAULT_FROM_NAME
  return `${name} <${email}>`
}

export async function sendEmail(input: {
  business: Business
  to: string
  content: EmailContent
  unsubUrl?: string
}): Promise<SendResult> {
  const { business, to, content, unsubUrl } = input

  if (!isResendConfigured()) {
    return {
      ok: false,
      error:
        "Resend is not configured. Add RESEND_API_KEY and DEFAULT_FROM_EMAIL.",
    }
  }

  try {
    const { data, error } = await resend().emails.send({
      from: fromHeader(business),
      to,
      replyTo: business.reply_to_email?.trim() || undefined,
      subject: content.subject,
      html: content.html,
      text: content.text,
      // One-click unsubscribe. Gmail and Yahoo require this on bulk mail and
      // it keeps the sending domain out of trouble.
      headers: unsubUrl
        ? {
            "List-Unsubscribe": `<${unsubUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          }
        : undefined,
    })

    if (error) return { ok: false, error: error.message }
    return { ok: true, providerId: data?.id }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
