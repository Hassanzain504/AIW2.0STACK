import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabase } from "@/lib/supabase/admin"
import { getBusinessById } from "@/lib/review/business"
import { googleReviewUrl } from "@/lib/review/links"

/**
 * Counts the hand-off to Google, then redirects. Google gives us nothing back
 * once the customer lands there, so the click is the last thing we can measure
 * and it is what tells the owner whether the flow is actually working.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createAdminSupabase()

  const { data: request } = await supabase
    .from("review_requests")
    .select("id, business_id, rating")
    .eq("token", token)
    .maybeSingle()

  if (!request) return NextResponse.redirect(new URL("/", _req.url))

  const business = await getBusinessById(request.business_id)
  const target = business ? googleReviewUrl(business) : null
  if (!target) {
    return NextResponse.redirect(new URL(`/r/${token}/thanks`, _req.url))
  }

  await supabase
    .from("review_requests")
    .update({
      google_clicked_at: new Date().toISOString(),
      status: "completed",
    })
    .eq("id", request.id)

  return NextResponse.redirect(target)
}
