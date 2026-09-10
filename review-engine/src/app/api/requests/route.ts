import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getBusinessByStaffToken } from "@/lib/review/business"
import { createReviewRequest } from "@/lib/review/create"
import { runFollowUps } from "@/lib/review/run-followups"

const schema = z
  .object({
    staffToken: z.string().min(8),
    name: z.string().trim().max(200).optional(),
    email: z.string().trim().email().max(320).optional().or(z.literal("")),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    serviceType: z.string().trim().max(200).optional(),
    techName: z.string().trim().max(200).optional(),
  })
  .refine((v) => Boolean(v.email) || Boolean(v.phone), {
    message: "Add an email or a phone number so we can follow up.",
    path: ["email"],
  })

/**
 * The technician's quick-add. Creates the job, schedules the whole chain, and
 * pushes the first email out before responding, so the customer has it before
 * the van leaves the driveway.
 */
export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Bad request" },
      { status: 400 }
    )
  }
  const input = parsed.data

  const business = await getBusinessByStaffToken(input.staffToken)
  if (!business) {
    return NextResponse.json({ error: "That link is not valid." }, { status: 404 })
  }

  try {
    const created = await createReviewRequest({
      business,
      contact: {
        name: input.name || null,
        email: input.email || null,
        phone: input.phone || null,
      },
      serviceType: input.serviceType || null,
      techName: input.techName || null,
      source: "sent",
    })

    if (created.scheduled > 0) {
      // Best effort. A failed send stays in the outbox and the cron retries it,
      // so the technician is never blocked by a provider hiccup.
      await runFollowUps({ requestId: created.requestId }).catch(() => undefined)
    }

    return NextResponse.json({
      ok: true,
      token: created.token,
      url: created.url,
      suppressed: created.suppressed,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
