import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { createAdminSupabase } from "@/lib/supabase/admin"

/**
 * Marks an unhappy customer as dealt with.
 *
 * Without this the acknowledged_at column never moves, so the daily digest
 * would report the same backlog for ever and the owner would stop reading it.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Read through the owner's session first, so row level security proves this
  // response belongs to a business they own.
  const { data: owned } = await supabase
    .from("responses")
    .select("id")
    .eq("id", id)
    .maybeSingle()
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const { error } = await createAdminSupabase()
    .from("responses")
    .update({ acknowledged_at: new Date().toISOString() })
    .eq("id", id)
    .is("acknowledged_at", null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
