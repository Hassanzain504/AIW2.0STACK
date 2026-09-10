import Link from "next/link"
import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/admin-session"
import { adminListConfigured } from "@/lib/admin"
import { createAdminSupabase } from "@/lib/supabase/admin"
import { createServerSupabase } from "@/lib/supabase/server"
import { APP_URL } from "@/lib/supabase/env"
import NewClientForm from "@/components/NewClientForm"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const admin = await getAdminSession()

  if (!admin) {
    const supabase = await createServerSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect("/dashboard/login")

    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-xl font-semibold">Not an admin account</h1>
        <p className="mt-2 text-sm text-muted">
          {user.email} is signed in but is not on the admin list.
        </p>
        {!adminListConfigured() ? (
          <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            ADMIN_EMAILS is empty, so the admin area is shut for everyone. Set
            it in the environment and redeploy.
          </p>
        ) : null}
      </main>
    )
  }

  const supabase = createAdminSupabase()
  const { data: businesses } = await supabase
    .from("businesses")
    .select(
      "id, name, slug, active, google_place_id, google_review_url, owner_user_id, owner_email, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <header>
        <h1 className="text-xl font-semibold">Clients</h1>
        <p className="mt-1 text-sm text-muted">Signed in as {admin.email}</p>
      </header>

      <section className="mt-8">
        {businesses && businesses.length > 0 ? (
          <ul className="divide-y divide-border rounded-xl border border-border">
            {businesses.map((row) => {
              const hasGoogle = Boolean(
                row.google_review_url || row.google_place_id
              )
              return (
                <li key={row.id}>
                  <Link
                    href={`/admin/${row.id}`}
                    className="flex items-center justify-between gap-3 p-4"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {row.name}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        /j/{row.slug}
                      </span>
                    </span>
                    {!hasGoogle ? (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900">
                        Needs setup
                      </span>
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted">
            No clients yet. Add the first one below.
          </p>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Add a client
        </h2>
        <div className="mt-4">
          <NewClientForm appUrl={APP_URL} />
        </div>
      </section>
    </main>
  )
}
