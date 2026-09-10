import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { authorizeBusiness } from "@/lib/review/authorize"
import { createAdminSupabase } from "@/lib/supabase/admin"

/**
 * Issues a new crew link and kills the old one.
 *
 * The staff link is a bearer credential: whoever holds it can log jobs for
 * this business. When a technician leaves or the link ends up somewhere it
 * should not be, this is the only way to take it back. Admin only, because it
 * breaks the link on every phone that has it saved.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const actor = await authorizeBusiness(id)
  if (!actor || actor.role !== "admin") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const token = randomBytes(24).toString("hex")

  const { error } = await createAdminSupabase()
    .from("businesses")
    .update({ staff_token: token })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, token })
}
