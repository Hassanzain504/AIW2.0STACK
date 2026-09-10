import { z } from "zod"
import { slugify } from "@/lib/admin"
import type { Role } from "./authorize"

const email = z.string().trim().email().max(320).or(z.literal(""))
const optionalText = (max: number) => z.string().trim().max(max).or(z.literal(""))

/**
 * What a client owner may change about their own business. Everything here is
 * theirs: their branding, their addresses, how hard they want to chase.
 */
export const ownerEditableSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  google: optionalText(500).optional(),
  ownerAlertEmail: email.optional(),
  fromName: optionalText(120).optional(),
  fromEmail: email.optional(),
  replyToEmail: email.optional(),
  postalAddress: optionalText(300).optional(),
  logoUrl: optionalText(500).optional(),
  brandColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #1d4ed8")
    .optional(),
  timezone: optionalText(60).optional(),
  followup1Days: z.number().int().min(1).max(60).optional(),
  followup2Days: z.number().int().min(1).max(120).optional(),
})

/**
 * Admin only, and each for a reason.
 *
 * slug, because changing it kills every QR code already printed. gate_mode,
 * because it is a legal risk call the student carries, not the client. active,
 * because it stops a paying client's system. owner_email, because it decides
 * who gets to claim the dashboard.
 */
export const adminOnlySchema = z.object({
  slug: optionalText(60).optional(),
  gateMode: z.enum(["hard_gate", "compliant"]).optional(),
  ownerEmail: email.optional(),
  active: z.boolean().optional(),
})

export const settingsSchema = ownerEditableSchema.merge(adminOnlySchema)

export type SettingsInput = z.infer<typeof settingsSchema>

/**
 * Turns validated input into a database patch, dropping anything the caller's
 * role is not allowed to touch. An owner posting gate_mode gets it silently
 * ignored rather than an error, because the field is simply not theirs.
 *
 * Only keys actually present are returned, so a partial save never wipes a
 * field the form did not send.
 */
export function toBusinessPatch(
  input: SettingsInput,
  role: Role
): Record<string, unknown> {
  const patch: Record<string, unknown> = {}
  const set = (key: string, value: unknown) => {
    patch[key] = value === "" ? null : value
  }

  if (input.name !== undefined) patch.name = input.name
  if (input.ownerAlertEmail !== undefined)
    set("owner_alert_email", input.ownerAlertEmail.toLowerCase())
  if (input.fromName !== undefined) set("from_name", input.fromName)
  if (input.fromEmail !== undefined)
    set("from_email", input.fromEmail.toLowerCase())
  if (input.replyToEmail !== undefined)
    set("reply_to_email", input.replyToEmail.toLowerCase())
  if (input.postalAddress !== undefined) set("postal_address", input.postalAddress)
  if (input.logoUrl !== undefined) set("logo_url", input.logoUrl)
  if (input.brandColor !== undefined) patch.brand_color = input.brandColor
  if (input.timezone !== undefined && input.timezone !== "")
    patch.timezone = input.timezone
  if (input.followup1Days !== undefined)
    patch.followup_1_days = input.followup1Days
  if (input.followup2Days !== undefined)
    patch.followup_2_days = input.followup2Days

  // One input holds either a full write-review URL or a bare place id, so both
  // columns are rewritten together. Sending an empty value clears both, which
  // is how a wrong link gets removed rather than sitting there half set.
  if (input.google !== undefined) {
    const value = input.google.trim()
    const isUrl = /^https?:\/\//i.test(value)
    patch.google_review_url = isUrl ? value : null
    patch.google_place_id = value && !isUrl ? value : null
  }

  if (role !== "admin") return patch

  if (input.slug !== undefined && input.slug !== "") {
    patch.slug = slugify(input.slug)
  }
  if (input.gateMode !== undefined) patch.gate_mode = input.gateMode
  if (input.ownerEmail !== undefined)
    set("owner_email", input.ownerEmail.toLowerCase())
  if (input.active !== undefined) patch.active = input.active

  return patch
}
