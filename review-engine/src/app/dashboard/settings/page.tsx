import Link from "next/link"
import { redirect } from "next/navigation"
import { createServerSupabase } from "@/lib/supabase/server"
import { getBusinessById } from "@/lib/review/business"
import { APP_URL } from "@/lib/supabase/env"
import SettingsForm from "@/components/SettingsForm"

export const dynamic = "force-dynamic"

export default async function OwnerSettingsPage() {
  const supabase = await createServerSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")

  // Row level security limits this to the business this owner owns.
  const { data: owned } = await supabase
    .from("businesses")
    .select("id")
    .limit(1)
    .maybeSingle()

  if (!owned) redirect("/dashboard")

  const business = await getBusinessById(owned.id)
  if (!business) redirect("/dashboard")

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <Link href="/dashboard" className="text-sm text-muted underline">
        Back to dashboard
      </Link>
      <h1 className="mt-4 text-xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-muted">{business.name}</p>

      <div className="mt-8">
        <SettingsForm business={business} role="owner" appUrl={APP_URL} />
      </div>
    </main>
  )
}
