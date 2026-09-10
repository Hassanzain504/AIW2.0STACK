import { NextRequest, NextResponse } from "next/server"
import { runFollowUps } from "@/lib/review/run-followups"

export const maxDuration = 300
export const dynamic = "force-dynamic"

function authorised(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET
  if (!expected) return true // dev convenience: no secret means open
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  if (req.headers.get("authorization") === `Bearer ${expected}`) return true
  // Fall-back for pg_cron and manual triggers
  return req.nextUrl.searchParams.get("secret") === expected
}

export async function GET(req: NextRequest) {
  if (!authorised(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const result = await runFollowUps()
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  return GET(req)
}
