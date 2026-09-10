/**
 * Centralised env var loading with validation.
 * Server-side code imports from here. The browser client reads the
 * NEXT_PUBLIC_ vars directly.
 */

export const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3006"
).replace(/\/+$/, "")

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? ""
export const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL ?? ""
export const DEFAULT_FROM_NAME = process.env.DEFAULT_FROM_NAME ?? "Reviews"

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
}

export function isResendConfigured(): boolean {
  return Boolean(RESEND_API_KEY && DEFAULT_FROM_EMAIL)
}
