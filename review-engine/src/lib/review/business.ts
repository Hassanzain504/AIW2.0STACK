import { createAdminSupabase } from "@/lib/supabase/admin"
import type { Business } from "@/lib/types"

const COLUMNS =
  "id, owner_user_id, slug, name, google_place_id, google_review_url, from_name, from_email, reply_to_email, owner_alert_email, owner_phone, gate_mode, brand_color, logo_url, timezone, staff_token, followup_1_days, followup_2_days, request_ttl_days, active"

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const supabase = createAdminSupabase()
  const { data } = await supabase
    .from("businesses")
    .select(COLUMNS)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle()
  return (data as Business | null) ?? null
}

/**
 * Holding the staff token is the whole credential for the technician screen.
 * That screen can only create review requests, so the blast radius of a leaked
 * link is limited to junk requests, not customer data.
 */
export async function getBusinessByStaffToken(
  staffToken: string
): Promise<Business | null> {
  const supabase = createAdminSupabase()
  const { data } = await supabase
    .from("businesses")
    .select(COLUMNS)
    .eq("staff_token", staffToken)
    .eq("active", true)
    .maybeSingle()
  return (data as Business | null) ?? null
}

export async function getBusinessById(id: string): Promise<Business | null> {
  const supabase = createAdminSupabase()
  const { data } = await supabase
    .from("businesses")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle()
  return (data as Business | null) ?? null
}
