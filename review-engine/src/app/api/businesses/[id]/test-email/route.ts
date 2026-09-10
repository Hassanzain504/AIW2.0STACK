import { NextRequest, NextResponse } from "next/server"
import { authorizeBusiness } from "@/lib/review/authorize"
import { getBusinessById } from "@/lib/review/business"
import { sendEmail } from "@/lib/email/send"

/**
 * Sends one real email through this client's configured sender.
 *
 * The most common way a client sits broken is an unverified Resend domain, and
 * that failure is invisible until a customer never receives a request. One
 * test send surfaces it while someone is still looking at the settings.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const actor = await authorizeBusiness(id)
  if (!actor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const business = await getBusinessById(id)
  if (!business) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const to = business.owner_alert_email?.trim() || actor.email
  if (!to) {
    return NextResponse.json(
      { error: "No address to send to. Set the owner alert email first." },
      { status: 400 }
    )
  }

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
    return NextResponse.json(
      { error: result.error ?? "Send failed" },
      { status: 400 }
    )
  }
  return NextResponse.json({ ok: true, to })
}
