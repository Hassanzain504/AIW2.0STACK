import { NextRequest, NextResponse } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

type CookieToSet = { name: string; value: string; options: CookieOptions }

/**
 * Refreshes the owner's session cookie. Only the dashboard needs it: the
 * customer-facing review pages are deliberately anonymous.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return res

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet: CookieToSet[]) {
        for (const { name, value, options } of cookiesToSet) {
          res.cookies.set(name, value, options)
        }
      },
    },
  })

  await supabase.auth.getUser()
  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}
