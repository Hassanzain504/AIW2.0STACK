import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The review page is embedded in emails and opened from QR codes on phones
  // that may be on flaky mobile data. Keep the payload small.
  poweredByHeader: false,
}

export default nextConfig
