import { createAdminSupabase } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email/send"
import { unsubscribeUrl } from "./links"
import { getBusinessById } from "./business"
import type { Business } from "@/lib/types"

export interface FollowUpRunResult {
  due: number
  emailsSent: number
  emailsFailed: number
  smsQueued: number
  cancelled: number
  skipped: number
  expired: number
}

const BATCH_SIZE = 200

export interface FollowUpRunOptions {
  /**
   * Limit the pass to a single request. Used right after a technician logs a
   * job so the first email leaves immediately instead of waiting for the next
   * scheduled run.
   */
  requestId?: string
}

interface DueRow {
  id: string
  business_id: string
  review_request_id: string | null
  channel: "email" | "sms" | "whatsapp"
  kind: string
  to_email: string | null
  to_phone: string | null
  subject: string | null
  body: string | null
  attempts: number
  review_requests: {
    status: string
    rating: number | null
    token: string
    expires_at: string
  } | null
  contacts: { opted_out_at: string | null } | null
}

/**
 * The whole follow-up engine. Runs on a schedule and does four things:
 *
 *   1. Cancels anything whose customer already answered or opted out.
 *   2. Sends the due emails through Resend.
 *   3. Moves due texts into the ready queue, where the owner taps to send
 *      them from their own phone. Nothing is sent through a gateway, which is
 *      what keeps A2P 10DLC registration out of the picture.
 *   4. Expires stale requests so the dashboard numbers stay honest.
 *
 * Safe to run more often than needed. Every row it touches gets a terminal
 * status in the same pass, so a second run in the same minute finds nothing.
 */
export async function runFollowUps(
  options: FollowUpRunOptions = {}
): Promise<FollowUpRunResult> {
  const supabase = createAdminSupabase()
  const result: FollowUpRunResult = {
    due: 0,
    emailsSent: 0,
    emailsFailed: 0,
    smsQueued: 0,
    cancelled: 0,
    skipped: 0,
    expired: 0,
  }

  let query = supabase
    .from("messages")
    .select(
      "id, business_id, review_request_id, channel, kind, to_email, to_phone, subject, body, attempts, review_requests(status, rating, token, expires_at), contacts(opted_out_at)"
    )
    .eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(BATCH_SIZE)

  if (options.requestId) query = query.eq("review_request_id", options.requestId)

  const { data, error } = await query

  if (error) throw new Error(`Could not read the outbox: ${error.message}`)

  const due = (data ?? []) as unknown as DueRow[]
  result.due = due.length

  const businesses = new Map<string, Business | null>()
  async function business(id: string): Promise<Business | null> {
    if (!businesses.has(id)) businesses.set(id, await getBusinessById(id))
    return businesses.get(id) ?? null
  }

  for (const row of due) {
    const request = row.review_requests

    // Already answered, stopped, or past its window. Nothing more goes out.
    const done =
      !request ||
      request.rating !== null ||
      ["rated", "completed", "stopped", "expired"].includes(request.status) ||
      new Date(request.expires_at).getTime() < Date.now()

    if (done) {
      await supabase
        .from("messages")
        .update({ status: "cancelled" })
        .eq("id", row.id)
      result.cancelled++
      continue
    }

    if (row.contacts?.opted_out_at) {
      await supabase
        .from("messages")
        .update({ status: "skipped", error: "Contact opted out" })
        .eq("id", row.id)
      result.skipped++
      continue
    }

    // Texts wait for a human tap. Marking them ready is the whole send step.
    if (row.channel !== "email") {
      await supabase.from("messages").update({ status: "ready" }).eq("id", row.id)
      result.smsQueued++
      continue
    }

    const biz = await business(row.business_id)
    if (!biz || !row.to_email || !row.subject || !row.body) {
      await supabase
        .from("messages")
        .update({
          status: "failed",
          error: "Message is missing its business, recipient, or content",
          attempts: row.attempts + 1,
        })
        .eq("id", row.id)
      result.emailsFailed++
      continue
    }

    const sent = await sendEmail({
      business: biz,
      to: row.to_email,
      content: { subject: row.subject, html: row.body, text: row.subject },
      unsubUrl: unsubscribeUrl(request.token),
    })

    if (sent.ok) {
      await supabase
        .from("messages")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          provider_id: sent.providerId ?? null,
          attempts: row.attempts + 1,
          error: null,
        })
        .eq("id", row.id)
      result.emailsSent++
    } else {
      // Three tries, then stop. A permanently bad address should not be
      // retried until the end of time.
      const attempts = row.attempts + 1
      await supabase
        .from("messages")
        .update({
          status: attempts >= 3 ? "failed" : "scheduled",
          attempts,
          error: sent.error ?? "Unknown send error",
          scheduled_at:
            attempts >= 3
              ? undefined
              : new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        })
        .eq("id", row.id)
      result.emailsFailed++
    }
  }

  // Close out requests nobody answered inside the window. Skipped on a scoped
  // pass, where the only job is to get one message moving.
  if (options.requestId) return result

  const { data: expired } = await supabase
    .from("review_requests")
    .update({ status: "expired" })
    .in("status", ["pending", "opened"])
    .lt("expires_at", new Date().toISOString())
    .select("id")
  result.expired = expired?.length ?? 0

  return result
}
