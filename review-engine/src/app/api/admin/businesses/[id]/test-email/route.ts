import { NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/admin-session"
import { getBusinessById } from "@/lib/review/business"
import { sendEmail } from "@/lib/email/send"

/**
 * Sends one real email through the client's configured sender.
 *
 * This exists because the most common way a new client sits broken is an
 * unverified Resend domain, and that failure is invisible until a customer
 * never receives a request. One test send surfaces it during onboarding
 * instead of a fortnight later.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminSession()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const business = await getBusinessById(id)
  if (!business) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const to = business.owner_alert_email?.trim() || admin.email

  const result = await sendEmail({
    business,
    to,
    content: {
      subject: `Test send for ${business.name}`,
      html: `<p style="font-family:sans-serif;font-size:15px;">This is a test from the review engine.</p><p style="font-family:sans-serif;font-size:15px;">If it arrived, ${business.name}'s sending setup works and review requests will go out properly.</p>`,
      text: `This is a test from the review engine. If it arrived, ${business.name}'s sending setup works.`,
    },
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Send failed" }, { status: 400 })
  }
  return NextResponse.json({ ok: true, to })
}
