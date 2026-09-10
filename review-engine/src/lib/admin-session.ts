import { createServerSupabase } from "@/lib/supabase/server"
import { isPlatformAdmin } from "@/lib/admin"

export interface AdminSession {
  userId: string
  email: string
}

/**
 * Returns the signed-in platform admin, or null. Every admin route and page
 * calls this first. It reads the session through the anon key so Supabase
 * verifies the JWT, then checks the address against the env list.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email || !isPlatformAdmin(user.email)) return null
  return { userId: user.id, email: user.email }
}
