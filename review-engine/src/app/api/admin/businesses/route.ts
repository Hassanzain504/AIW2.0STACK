import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAdminSession } from "@/lib/admin-session"
import { slugify } from "@/lib/admin"
import { createAdminSupabase } from "@/lib/supabase/admin"

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().max(60).optional().or(z.literal("")),
  // One field takes either a full write-review URL or a bare place id. Asking
  // a non-technical operator to know the difference is how the wrong value
  // ends up in the wrong column.
  google: z.string().trim().max(500).optional().or(z.literal("")),
  ownerAlertEmail: z.string().trim().email().max(320),
  ownerEmail: z.string().trim().email().max(320).optional().or(z.literal("")),
  fromEmail: z.string().trim().email().max(320).optional().or(z.literal("")),
  fromName: z.string().trim().max(120).optional(),
  replyToEmail: z.string().trim().email().max(320).optional().or(z.literal("")),
  postalAddress: z.string().trim().max(300).optional(),
  brandColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #1d4ed8")
    .optional()
    .or(z.literal("")),
  timezone: z.string().trim().max(60).optional().or(z.literal("")),
  gateMode: z.enum(["hard_gate", "compliant"]).optional(),
  followup1Days: z.number().int().min(1).max(60).optional(),
  followup2Days: z.number().int().min(1).max(120).optional(),
})

export async function POST(req: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the form" },
      { status: 400 }
    )
  }
  const input = parsed.data

  const slug = slugify(input.slug || input.name)
  if (!slug) {
    return NextResponse.json(
      { error: "That name does not produce a usable link. Add a slug by hand." },
      { status: 400 }
    )
  }

  const google = input.google?.trim() ?? ""
  const isUrl = /^https?:\/\//i.test(google)

  const supabase = createAdminSupabase()

  const { data, error } = await supabase
    .from("businesses")
    .insert({
      name: input.name,
      slug,
      google_review_url: isUrl ? google : null,
      google_place_id: google && !isUrl ? google : null,
      owner_alert_email: input.ownerAlertEmail.toLowerCase(),
      owner_email: input.ownerEmail?.toLowerCase() || null,
      from_email: input.fromEmail?.toLowerCase() || null,
      from_name: input.fromName?.trim() || input.name,
      reply_to_email: input.replyToEmail?.toLowerCase() || null,
      postal_address: input.postalAddress?.trim() || null,
      brand_color: input.brandColor || "#111827",
      timezone: input.timezone || "America/New_York",
      gate_mode: input.gateMode ?? "hard_gate",
      followup_1_days: input.followup1Days ?? 3,
      followup_2_days: input.followup2Days ?? 7,
    })
    .select("id, slug")
    .single()

  if (error) {
    // 23505 is a unique violation. The slug and the owner email are the two
    // columns that can collide, and the operator needs to know which.
    const message =
      error.code === "23505"
        ? "Something here is already taken, most likely the link name or the owner's email. Try a different one."
        : error.message
    return NextResponse.json({ error: message }, { status: 400 })
  }

  return NextResponse.json({ ok: true, id: data.id, slug: data.slug })
}
