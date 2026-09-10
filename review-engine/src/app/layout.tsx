import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Leave a review",
  description: "Tell us how we did. It takes about ten seconds.",
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
