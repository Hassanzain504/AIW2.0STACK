export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-xl font-semibold">Review Engine</h1>
      <p className="mt-2 text-sm text-muted">
        This is the review request system. There is nothing to see on this page.
        Business owners sign in at{" "}
        <a href="/dashboard" className="underline">
          the dashboard
        </a>
        .
      </p>
    </main>
  )
}
