/**
 * Supabase types an embedded relation as an array even when the foreign key
 * makes it at most one row, and returns a bare object at runtime. This narrows
 * both shapes to the single value the caller actually wants.
 */
export function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null
  return Array.isArray(value) ? (value[0] ?? null) : value
}
