import { notFound } from "next/navigation"
import { createAdminSupabase } from "@/lib/supabase/admin"
import { getBusinessById } from "@/lib/review/business"
import { decideRoute } from "@/lib/review/gate"
import { googleReviewUrl, hasExpired } from "@/lib/review/links"
import StarPicker from "@/components/StarPicker"

export const dynamic = "force-dynamic"

function Shell({
  businessName,
  logoUrl,
  children,
}: {
  businessName: string
  logoUrl: string | null
  children: React.ReactNode
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8 text-center">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={businessName}
            className="mx-auto h-12 w-auto object-contain"
          />
        ) : (
          <p className="text-base font-semibold">{businessName}</p>
        )}
      </div>
      {children}
    </main>
  )
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = createAdminSupabase()

  const { data: request } = await supabase
    .from("review_requests")
    .select("id, business_id, status, rating, expires_at, opened_at")
    .eq("token", token)
    .maybeSingle()

  if (!request) notFound()

  const business = await getBusinessById(request.business_id)
  if (!business || !business.active) notFound()

  const expired = hasExpired(request.expires_at)

  if (expired) {
    return (
      <Shell businessName={business.name} logoUrl={business.logo_url}>
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            This link has expired
          </h1>
          <p className="mt-2 text-sm text-muted">
            Thanks anyway. If you still want to say something, get in touch with{" "}
            {business.name} directly.
          </p>
        </div>
      </Shell>
    )
  }

  // Mark the open once. It is what separates "never looked" from "looked and
  // did not rate", and those two need different follow-up copy later on.
  if (!request.opened_at) {
    await supabase
      .from("review_requests")
      .update({ opened_at: new Date().toISOString(), status: "opened" })
      .eq("id", request.id)
      .eq("status", "pending")
  }

  // Someone reopening the link after answering should not be asked twice.
  if (request.rating !== null) {
    const decision = decideRoute(request.rating, business.gate_mode)
    const target = decision.showGoogle ? googleReviewUrl(business) : null

    return (
      <Shell businessName={business.name} logoUrl={business.logo_url}>
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            You have already rated this
          </h1>
          <p className="mt-2 text-sm text-muted">
            Thanks for taking the time.
          </p>
          {target ? (
            <a
              href={`/r/${token}/go`}
              className="mt-6 block w-full rounded-lg px-6 py-4 text-base font-semibold text-white"
              style={{ backgroundColor: business.brand_color }}
            >
              Write a Google review
            </a>
          ) : null}
        </div>
      </Shell>
    )
  }

  return (
    <Shell businessName={business.name} logoUrl={business.logo_url}>
      <StarPicker
        token={token}
        businessName={business.name}
        brandColor={business.brand_color}
      />
      <p className="mt-10 text-center text-xs text-muted">
        Your rating goes to {business.name}.
      </p>
    </Shell>
  )
}
