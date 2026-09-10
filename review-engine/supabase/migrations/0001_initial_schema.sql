-- =============================================================================
-- AIW Review Engine, initial schema
-- =============================================================================
-- Multi-tenant. One deployment serves every client the student sells to.
-- Run this once in the Supabase SQL Editor after creating the project.
-- Re-runnable: every CREATE uses IF NOT EXISTS where possible.
--
-- Stack assumptions:
--   - Postgres 15+ (Supabase default)
--   - Supabase Auth holds business owners; end customers never authenticate
--   - The public review flow runs server-side with the service role, so anon
--     has no direct table access at all
-- =============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------

-- hard_gate:  only 4 and 5 star ratings see the Google link
-- compliant:  every rating can reach Google, low ratings see recovery first
do $$ begin
  create type gate_mode as enum ('hard_gate', 'compliant');
exception when duplicate_object then null; end $$;

do $$ begin
  create type request_status as enum (
    'pending', 'opened', 'rated', 'completed', 'expired', 'stopped'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type message_channel as enum ('email', 'sms', 'whatsapp');
exception when duplicate_object then null; end $$;

-- scheduled: waiting for its send time
-- ready:     an sms/whatsapp message whose time has come, waiting for a human tap
-- sent:      delivered to the provider, or confirmed tapped for sms
do $$ begin
  create type message_status as enum (
    'scheduled', 'ready', 'sent', 'failed', 'cancelled', 'skipped'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type message_kind as enum (
    'initial', 'followup_1', 'followup_2', 'low_rating_alert'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type response_route as enum ('google', 'private');
exception when duplicate_object then null; end $$;

do $$ begin
  create type suppression_reason as enum (
    'unsubscribed', 'sms_stop', 'bounced', 'complaint', 'manual'
  );
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- BUSINESSES, one row per client the student sells to
-- ----------------------------------------------------------------------------
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users (id) on delete set null,

  slug text not null unique,
  name text not null,

  -- Where a happy customer is sent. Either paste the full URL or the place id
  -- and let the app build the URL.
  google_place_id text,
  google_review_url text,

  -- Sending identity. The domain must be verified in Resend before the first
  -- send, otherwise Resend rejects the message.
  from_name text,
  from_email text,
  reply_to_email text,
  owner_alert_email text,

  -- The number the owner or technician sends SMS from is their own handset, so
  -- we store it only to show on screen, never to send through a gateway.
  owner_phone text,

  gate_mode gate_mode not null default 'hard_gate',
  brand_color text not null default '#111827',
  logo_url text,
  timezone text not null default 'America/New_York',

  -- Long random value. Whoever holds it can create review requests for this
  -- business and nothing else. Printed into the technician link and the QR.
  staff_token text not null unique default encode(gen_random_bytes(24), 'hex'),

  followup_1_days int not null default 3,
  followup_2_days int not null default 7,
  request_ttl_days int not null default 30,

  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_businesses_owner
  on public.businesses (owner_user_id) where active;

-- ----------------------------------------------------------------------------
-- CONTACTS, the end customers
-- ----------------------------------------------------------------------------
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text,
  email text,
  phone text,
  opted_out_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contacts_need_a_channel
    check (email is not null or phone is not null)
);

create unique index if not exists idx_contacts_business_email
  on public.contacts (business_id, lower(email)) where email is not null;
create unique index if not exists idx_contacts_business_phone
  on public.contacts (business_id, phone) where phone is not null;

-- ----------------------------------------------------------------------------
-- JOBS, one completed piece of work
-- ----------------------------------------------------------------------------
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,
  service_type text,
  tech_name text,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_jobs_business_completed
  on public.jobs (business_id, completed_at desc);

-- ----------------------------------------------------------------------------
-- REVIEW REQUESTS, one per job, addressed by an unguessable token
-- ----------------------------------------------------------------------------
create table if not exists public.review_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  job_id uuid references public.jobs (id) on delete set null,
  contact_id uuid references public.contacts (id) on delete set null,

  token text not null unique default encode(gen_random_bytes(16), 'hex'),
  status request_status not null default 'pending',
  rating int check (rating between 1 and 5),

  -- Set when the request came from a scanned QR rather than a sent link, so
  -- walk-up scans stay distinguishable from messaged ones in the numbers.
  source text not null default 'sent',

  opened_at timestamptz,
  rated_at timestamptz,
  google_clicked_at timestamptz,
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_requests_business_created
  on public.review_requests (business_id, created_at desc);
create index if not exists idx_requests_open
  on public.review_requests (business_id, status)
  where status in ('pending', 'opened');

-- ----------------------------------------------------------------------------
-- MESSAGES, the outbox. Every send, past and future, is a row here.
-- ----------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  review_request_id uuid references public.review_requests (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,

  channel message_channel not null,
  kind message_kind not null,
  status message_status not null default 'scheduled',

  scheduled_at timestamptz not null default now(),
  sent_at timestamptz,
  attempts int not null default 0,
  error text,
  provider_id text,

  to_email text,
  to_phone text,
  subject text,
  body text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The cron handler leans on this index every run.
create index if not exists idx_messages_due
  on public.messages (scheduled_at)
  where status = 'scheduled';
create index if not exists idx_messages_ready_taps
  on public.messages (business_id, scheduled_at)
  where status = 'ready';
create index if not exists idx_messages_request
  on public.messages (review_request_id);

-- ----------------------------------------------------------------------------
-- RESPONSES, what the customer actually said
-- ----------------------------------------------------------------------------
create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  review_request_id uuid not null references public.review_requests (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  routed_to response_route not null,
  comment text,
  contact_name text,
  contact_email text,
  contact_phone text,
  acknowledged_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_responses_business_created
  on public.responses (business_id, created_at desc);
create index if not exists idx_responses_unacknowledged
  on public.responses (business_id)
  where routed_to = 'private' and acknowledged_at is null;

-- ----------------------------------------------------------------------------
-- SUPPRESSIONS, people who told us to stop
-- ----------------------------------------------------------------------------
create table if not exists public.suppressions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  email text,
  phone text,
  reason suppression_reason not null default 'unsubscribed',
  created_at timestamptz not null default now(),
  constraint suppressions_need_a_target
    check (email is not null or phone is not null)
);

create unique index if not exists idx_suppressions_email
  on public.suppressions (business_id, lower(email)) where email is not null;
create unique index if not exists idx_suppressions_phone
  on public.suppressions (business_id, phone) where phone is not null;

-- ----------------------------------------------------------------------------
-- updated_at maintenance
-- ----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'businesses', 'contacts', 'review_requests', 'messages'
  ] loop
    execute format(
      'drop trigger if exists trg_%1$s_touch on public.%1$s', t
    );
    execute format(
      'create trigger trg_%1$s_touch before update on public.%1$s
         for each row execute function public.touch_updated_at()', t
    );
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
-- Owners read their own rows through the anon key. Every write, and the whole
-- public review flow, goes through the service role in server code, which
-- bypasses RLS. So there is no anon write policy anywhere by design.

alter table public.businesses      enable row level security;
alter table public.contacts        enable row level security;
alter table public.jobs            enable row level security;
alter table public.review_requests enable row level security;
alter table public.messages        enable row level security;
alter table public.responses       enable row level security;
alter table public.suppressions    enable row level security;

create or replace function public.owns_business(target uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.businesses b
    where b.id = target and b.owner_user_id = auth.uid()
  );
$$;

drop policy if exists businesses_owner_select on public.businesses;
create policy businesses_owner_select on public.businesses
  for select to authenticated using (owner_user_id = auth.uid());

drop policy if exists businesses_owner_update on public.businesses;
create policy businesses_owner_update on public.businesses
  for update to authenticated
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array[
    'contacts', 'jobs', 'review_requests', 'messages', 'responses', 'suppressions'
  ] loop
    execute format('drop policy if exists %1$s_owner_select on public.%1$s', t);
    execute format(
      'create policy %1$s_owner_select on public.%1$s
         for select to authenticated using (public.owns_business(business_id))', t
    );
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- DASHBOARD ROLLUP
-- ----------------------------------------------------------------------------
create or replace view public.business_stats
with (security_invoker = true) as
select
  b.id as business_id,
  count(distinct rr.id)                                          as requests_sent,
  count(distinct rr.id) filter (where rr.rating is not null)      as ratings_received,
  count(distinct rr.id) filter (where rr.google_clicked_at is not null)
                                                                 as google_clicks,
  count(distinct rr.id) filter (where rr.rating >= 4)             as happy,
  count(distinct rr.id) filter (where rr.rating <= 3)             as unhappy,
  round(avg(rr.rating)::numeric, 2)                              as avg_rating
from public.businesses b
left join public.review_requests rr on rr.business_id = b.id
group by b.id;
