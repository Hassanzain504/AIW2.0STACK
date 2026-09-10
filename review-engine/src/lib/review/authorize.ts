import { getAdminSession } from "@/lib/admin-session"
import { createServerSupabase } from "@/lib/supabase/server"

export type Role = "admin" | "owner"

export interface Actor {
  role: Role
  email: string
  userId: string
}

/**
 * Who is acting on this business, if anyone.
 *
 * Admin is the student, who operates every client. Owner is one client, proven
 * by reading the row back through their own session so row level security does
 * the checking rather than a hand-written comparison.
 *
 * Returns null when the caller is neither, which every route treats as a 404
 * or a 401 rather than leaking whether the business exists.
 */
export async function authorizeBusiness(
  businessId: string
): Promise<Actor | null> {
  const admin = await getAdminSession()
  if (admin) {
    return { role: "admin", email: admin.email, userId: admin.userId }
  }

  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: owned } = await supabase
    .from("businesses")
    .select("id")
    .eq("id", businessId)
    .maybeSingle()

  if (!owned) return null
  return { role: "owner", email: user.email ?? "", userId: user.id }
}
