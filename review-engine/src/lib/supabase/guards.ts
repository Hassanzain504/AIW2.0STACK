import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env"

export { SUPABASE_ANON_KEY, SUPABASE_URL }

export function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local."
    )
  }
}
