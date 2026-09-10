import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { createAdminSupabase } from "@/lib/supabase/admin"

/**
 * Marks a text as sent after the owner tapped through to their messaging app.
 *
 * We cannot observe the actual send, because it happens inside the handset's
 * own SMS app. Recording the tap is the closest honest signal, and it is what
 * stops the same text sitting in the queue for ever.
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

  // Read through the owner's own session so row level security proves the
  // message belongs to a business they own.
  const { data: owned } = await supabase
    .from("messages")
    .select("id")
    .eq("id", id)
    .maybeSingle()
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const admin = createAdminSupabase()
  const { error } = await admin
    .from("messages")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "ready")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
