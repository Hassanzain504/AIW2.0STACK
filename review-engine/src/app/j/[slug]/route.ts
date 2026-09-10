import { NextRequest, NextResponse } from "next/server"
import { getBusinessBySlug } from "@/lib/review/business"
import { createReviewRequest } from "@/lib/review/create"

/**
 * The QR target. Printed on a van, an invoice, or shown on the technician's
 * phone at the door.
 *
 * Every scan mints a fresh request and redirects to it, so two customers never
 * share a link and each rating maps to one job. There is no contact attached,
 * which means no follow-up chain: a walk-up scan either converts on the spot or
 * it does not. That is the trade for asking nothing of the customer.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const business = await getBusinessBySlug(slug)
  if (!business) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  const created = await createReviewRequest({ business, source: "qr" })
  return NextResponse.redirect(new URL(`/r/${created.token}`, req.url))
}

// Every scan must mint a new request, so nothing here may be cached.
export const dynamic = "force-dynamic"
