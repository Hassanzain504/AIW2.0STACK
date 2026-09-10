import { createAdminSupabase } from "@/lib/supabase/admin"
import { buildCustomerEmail } from "@/lib/email/templates"
import { buildSmsBody } from "@/lib/sms/templates"
import { normalisePhone } from "@/lib/sms/link"
import { reviewUrl, unsubscribeUrl } from "./links"
import type { Business, CustomerMessageKind } from "@/lib/types"

export interface CreateRequestInput {
  business: Business
  contact?: {
    name?: string | null
    email?: string | null
    phone?: string | null
  }
  serviceType?: string | null
  techName?: string | null
  /** "sent" for a messaged request, "qr" for a walk-up scan. */
  source?: "sent" | "qr"
}

export interface CreateRequestResult {
  requestId: string
  token: string
  url: string
  contactId: string | null
  scheduled: number
  suppressed: boolean
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

/**
 * True when this person has already told this business to stop. Checked before
 * anything is scheduled, so an opt-out is honoured even if a technician adds
 * the same customer again months later.
 */
async function isSuppressed(
  businessId: string,
  email: string | null,
  phone: string | null
): Promise<boolean> {
  if (!email && !phone) return false
  const supabase = createAdminSupabase()

  const filters: string[] = []
  if (email) filters.push(`email.eq.${email}`)
  if (phone) filters.push(`phone.eq.${phone}`)

  const { data } = await supabase
    .from("suppressions")
    .select("id")
    .eq("business_id", businessId)
    .or(filters.join(","))
    .limit(1)

  return Boolean(data && data.length > 0)
}

/**
 * Creates the job, the contact, the review request, and the whole message plan
 * in one go.
 *
 * The message plan is written up front rather than decided later. Every future
 * send already exists as a row with a scheduled_at, so the cron handler only
 * has to ask "what is due" and the outbox is inspectable before anything goes
 * out. Cancelling a follow-up is then a status flip, not a scheduler problem.
 */
export async function createReviewRequest(
  input: CreateRequestInput
): Promise<CreateRequestResult> {
  const supabase = createAdminSupabase()
  const { business, serviceType = null, techName = null, source = "sent" } = input

  const rawEmail = input.contact?.email?.trim().toLowerCase() || null
  const rawPhone = input.contact?.phone?.trim()
    ? normalisePhone(input.contact.phone)
    : null
  const name = input.contact?.name?.trim() || null

  // ---- contact -------------------------------------------------------------
  let contactId: string | null = null
  if (rawEmail || rawPhone) {
    const { data: existing } = await supabase
      .from("contacts")
      .select("id, name, opted_out_at")
      .eq("business_id", business.id)
      .or(
        [
          rawEmail ? `email.eq.${rawEmail}` : null,
          rawPhone ? `phone.eq.${rawPhone}` : null,
        ]
          .filter(Boolean)
          .join(",")
      )
      .limit(1)
      .maybeSingle()

    if (existing) {
      contactId = existing.id
      await supabase
        .from("contacts")
        .update({
          name: name ?? existing.name,
          ...(rawEmail ? { email: rawEmail } : {}),
          ...(rawPhone ? { phone: rawPhone } : {}),
        })
        .eq("id", existing.id)
    } else {
      const { data: created, error } = await supabase
        .from("contacts")
        .insert({
          business_id: business.id,
          name,
          email: rawEmail,
          phone: rawPhone,
        })
        .select("id")
        .single()
      if (error) throw new Error(`Could not save the contact: ${error.message}`)
      contactId = created.id
    }
  }

  // ---- job -----------------------------------------------------------------
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .insert({
      business_id: business.id,
      contact_id: contactId,
      service_type: serviceType,
      tech_name: techName,
    })
    .select("id")
    .single()
  if (jobError) throw new Error(`Could not save the job: ${jobError.message}`)

  // ---- request -------------------------------------------------------------
  const { data: request, error: requestError } = await supabase
    .from("review_requests")
    .insert({
      business_id: business.id,
      job_id: job.id,
      contact_id: contactId,
      source,
      expires_at: daysFromNow(business.request_ttl_days),
    })
    .select("id, token")
    .single()
  if (requestError) {
    throw new Error(`Could not create the request: ${requestError.message}`)
  }

  const url = reviewUrl(request.token)
  const unsubUrl = unsubscribeUrl(request.token)

  // ---- message plan --------------------------------------------------------
  const suppressed = await isSuppressed(business.id, rawEmail, rawPhone)

  if (suppressed || (!rawEmail && !rawPhone)) {
    return {
      requestId: request.id,
      token: request.token,
      url,
      contactId,
      scheduled: 0,
      suppressed,
    }
  }

  const steps: Array<{ kind: CustomerMessageKind; days: number }> = [
    { kind: "initial", days: 0 },
    { kind: "followup_1", days: business.followup_1_days },
    { kind: "followup_2", days: business.followup_2_days },
  ]

  type Row = Record<string, unknown>
  const rows: Row[] = []

  for (const step of steps) {
    const kind = step.kind
    const scheduledAt = daysFromNow(step.days)

    if (rawEmail) {
      const content = buildCustomerEmail({
        business,
        kind,
        contactName: name,
        serviceType,
        reviewUrl: url,
        unsubUrl,
      })
      rows.push({
        business_id: business.id,
        review_request_id: request.id,
        contact_id: contactId,
        channel: "email",
        kind,
        status: "scheduled",
        scheduled_at: scheduledAt,
        to_email: rawEmail,
        subject: content.subject,
        body: content.html,
      })
    }

    // SMS only goes on the first two steps. A third text reads as pestering,
    // and it costs a human tap each time.
    if (rawPhone && kind !== "followup_2") {
      rows.push({
        business_id: business.id,
        review_request_id: request.id,
        contact_id: contactId,
        channel: "sms",
        kind,
        // The first text is available to send the moment the job is logged.
        // Later ones wait for the cron to mark them ready.
        status: step.days === 0 ? "ready" : "scheduled",
        scheduled_at: scheduledAt,
        to_phone: rawPhone,
        body: buildSmsBody({
          businessName: business.name,
          contactName: name,
          serviceType,
          reviewUrl: url,
          kind,
        }),
      })
    }
  }

  if (rows.length > 0) {
    const { error } = await supabase.from("messages").insert(rows)
    if (error) throw new Error(`Could not schedule messages: ${error.message}`)
  }

  return {
    requestId: request.id,
    token: request.token,
    url,
    contactId,
    scheduled: rows.length,
    suppressed: false,
  }
}

/**
 * Stops every pending message for a request. Called as soon as the customer
 * rates, because chasing someone who already answered is the fastest way to
 * get the business marked as spam.
 */
export async function cancelPendingMessages(
  requestId: string
): Promise<number> {
  const supabase = createAdminSupabase()
  const { data, error } = await supabase
    .from("messages")
    .update({ status: "cancelled" })
    .eq("review_request_id", requestId)
    .in("status", ["scheduled", "ready"])
    .select("id")

  if (error) throw new Error(`Could not cancel messages: ${error.message}`)
  return data?.length ?? 0
}
