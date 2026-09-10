/**
 * Platform admin check.
 *
 * The student running the agency operates every client on one deployment, so
 * they need a view above any single business. There is no admin table: the
 * allowed addresses are an env var, which keeps the list out of the database
 * where a compromised business owner could ever reach it.
 *
 * Set ADMIN_EMAILS to a comma separated list.
 */
const RAW = process.env.ADMIN_EMAILS ?? ""

const ADMINS = new Set(
  RAW.split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
)

export function isPlatformAdmin(email: string | null | undefined): boolean {
  // An empty list locks the admin area entirely rather than opening it. A
  // missing env var must never be the thing that grants access.
  if (ADMINS.size === 0) return false
  if (!email) return false
  return ADMINS.has(email.trim().toLowerCase())
}

export function adminListConfigured(): boolean {
  return ADMINS.size > 0
}

/** Turns a business name into a URL-safe slug for the walk-up QR link. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}
