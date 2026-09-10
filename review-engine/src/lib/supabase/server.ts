import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { SUPABASE_ANON_KEY, SUPABASE_URL, assertSupabaseConfigured } from "./guards"

type CookieToSet = { name: string; value: string; options: CookieOptions }

/**
 * Cookie-backed Supabase client for the owner dashboard. Respects row level
 * security, so an owner only ever sees their own business.
 */
export async function createServerSupabase() {
  assertSupabaseConfigured()
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Middleware refreshes the session instead.
        }
      },
    },
  })
}
