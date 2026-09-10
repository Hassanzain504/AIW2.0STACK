import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getAdminSession } from "@/lib/admin-session"
import { getBusinessById } from "@/lib/review/business"
import { staffUrl } from "@/lib/review/links"
import { APP_URL } from "@/lib/supabase/env"
import SettingsForm from "@/components/SettingsForm"
import RotateTokenButton from "@/components/RotateTokenButton"
import CopyField from "@/components/CopyField"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const admin = await getAdminSession()
  if (!admin) redirect("/admin")

  const { id } = await params
  const business = await getBusinessById(id)
  if (!business) notFound()

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <Link href={`/admin/${business.id}`} className="text-sm text-muted underline">
        Back to {business.name}
      </Link>
      <h1 className="mt-4 text-xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-muted">
        You are editing as an admin, so you see everything.
      </p>

      <div className="mt-8">
        <SettingsForm business={business} role="admin" appUrl={APP_URL} />
      </div>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Crew link
        </h2>
        <CopyField label="Current link" value={staffUrl(business.staff_token)} />
        <p className="mt-3 text-xs text-muted">
          Anyone holding this can log jobs for {business.name}. Issue a new one
          if a technician leaves or the link ends up somewhere it should not be.
        </p>
        <div className="mt-4">
          <RotateTokenButton businessId={business.id} />
        </div>
      </section>
    </main>
  )
}
