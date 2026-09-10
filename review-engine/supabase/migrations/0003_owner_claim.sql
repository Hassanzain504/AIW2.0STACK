-- =============================================================================
-- AIW Review Engine, 0003
-- =============================================================================
-- Lets a business be onboarded before its owner has ever signed in.
--
-- Until now owner_user_id had to be set by hand, which meant every new client
-- ended with someone running SQL against production. The onboarding screen
-- records owner_email instead, and the dashboard claims the business the first
-- time a user signs in with that address. Supabase has already proven the
-- address by then, because sign-in is a magic link sent to it.
-- =============================================================================

alter table public.businesses
  add column if not exists owner_email text;

create unique index if not exists idx_businesses_owner_email
  on public.businesses (lower(owner_email))
  where owner_email is not null;
