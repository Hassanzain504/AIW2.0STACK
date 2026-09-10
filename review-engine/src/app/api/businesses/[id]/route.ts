import { NextRequest, NextResponse } from "next/server"
import { authorizeBusiness } from "@/lib/review/authorize"
import { settingsSchema, toBusinessPatch } from "@/lib/review/settings"
import { createAdminSupabase } from "@/lib/supabase/admin"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const actor = await authorizeBusiness(id)
  if (!actor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const parsed = settingsSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the form" },
      { status: 400 }
    )
  }

  const patch = toBusinessPatch(parsed.data, actor.role)
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: true, changed: 0 })
  }

  const { error } = await createAdminSupabase()
    .from("businesses")
    .update(patch)
    .eq("id", id)

  if (error) {
    const message =
      error.code === "23505"
        ? "That link name or owner email is already used by another client."
        : error.message
    return NextResponse.json({ error: message }, { status: 400 })
  }

  return NextResponse.json({ ok: true, changed: Object.keys(patch).length })
}
