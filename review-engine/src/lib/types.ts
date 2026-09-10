export type GateMode = "hard_gate" | "compliant"

export type RequestStatus =
  | "pending"
  | "opened"
  | "rated"
  | "completed"
  | "expired"
  | "stopped"

export type MessageChannel = "email" | "sms" | "whatsapp"

export type MessageStatus =
  | "scheduled"
  | "ready"
  | "sent"
  | "failed"
  | "cancelled"
  | "skipped"

export type MessageKind =
  | "initial"
  | "followup_1"
  | "followup_2"
  | "low_rating_alert"
  | "owner_digest"

/** The kinds that actually go to an end customer, as opposed to the owner. */
export type CustomerMessageKind = "initial" | "followup_1" | "followup_2"

export type ResponseRoute = "google" | "private"

export interface Business {
  id: string
  owner_user_id: string | null
  slug: string
  name: string
  google_place_id: string | null
  google_review_url: string | null
  from_name: string | null
  from_email: string | null
  reply_to_email: string | null
  owner_alert_email: string | null
  owner_phone: string | null
  postal_address: string | null
  gate_mode: GateMode
  brand_color: string
  logo_url: string | null
  timezone: string
  staff_token: string
  followup_1_days: number
  followup_2_days: number
  request_ttl_days: number
  active: boolean
}

export interface Contact {
  id: string
  business_id: string
  name: string | null
  email: string | null
  phone: string | null
  opted_out_at: string | null
}

export interface ReviewRequest {
  id: string
  business_id: string
  job_id: string | null
  contact_id: string | null
  token: string
  status: RequestStatus
  rating: number | null
  source: string
  opened_at: string | null
  rated_at: string | null
  google_clicked_at: string | null
  expires_at: string
}

export interface OutboxMessage {
  id: string
  business_id: string
  review_request_id: string | null
  channel: MessageChannel
  kind: MessageKind
  status: MessageStatus
  scheduled_at: string
  to_email: string | null
  to_phone: string | null
  subject: string | null
  body: string | null
}
