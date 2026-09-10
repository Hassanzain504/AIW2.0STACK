-- =============================================================================
-- AIW Review Engine, 0002
-- =============================================================================
-- Two additions:
--
--   1. businesses.postal_address. United States clients send commercial email
--      under CAN-SPAM, which wants a physical postal address in the footer. A
--      review request following a completed job is defensibly transactional
--      rather than commercial, so this is belt and braces, but it costs one
--      column and removes the argument.
--
--   2. The owner digest. Texts in this system wait for a human tap, so without
--      a daily nudge the ready queue just grows and the SMS half of the
--      follow-up chain never actually sends. The digest is what closes that
--      loop, and it is recorded in messages like every other send so the
--      outbox stays the single record of what left the system.
-- =============================================================================

alter table public.businesses
  add column if not exists postal_address text;

do $$ begin
  alter type message_kind add value if not exists 'owner_digest';
exception when duplicate_object then null; end $$;

-- Answers "has today's digest already gone out for this business", which is
-- the only question the cron asks of these rows.
create index if not exists idx_messages_owner_digest
  on public.messages (business_id, sent_at desc)
  where kind = 'owner_digest';
