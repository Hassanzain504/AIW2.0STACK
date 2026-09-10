import { notFound } from "next/navigation"
import QRCode from "qrcode"
import { getBusinessByStaffToken } from "@/lib/review/business"
import { qrTargetUrl } from "@/lib/review/links"
import StaffForm from "@/components/StaffForm"

export const dynamic = "force-dynamic"

export default async function StaffPage({
  params,
}: {
  params: Promise<{ staffToken: string }>
}) {
  const { staffToken } = await params

  const business = await getBusinessByStaffToken(staffToken)
  if (!business) notFound()

  const walkUpUrl = qrTargetUrl(business)
  const walkUpQr = await QRCode.toDataURL(walkUpUrl, { margin: 1, width: 480 })

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-10">
      <StaffForm
        staffToken={staffToken}
        businessName={business.name}
        brandColor={business.brand_color}
        walkUpQr={walkUpQr}
        walkUpUrl={walkUpUrl}
      />
    </main>
  )
}
