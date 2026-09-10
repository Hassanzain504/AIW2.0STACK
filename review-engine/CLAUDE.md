# CLAUDE.md, Review Engine

The review engine is the third product in this stack, alongside the website
factory and the content engine. It is a **client deliverable**: the student
sells it to their niche clients as a recurring service, the same way they sell
a website.

Keep the three actors straight:

| Actor | Example for niche = roofers | Role here |
|---|---|---|
| The student | An AIW grad running a niche agency | Operates one deployment, onboards each client as a row in `businesses` |
| The student's client | A roofing company | Logs finished jobs, taps out texts, reads the unhappy-customer feed |
| The end customer | A homeowner who just had a roof done | Taps a star rating and either posts on Google or tells the owner what went wrong |

Every screen the end customer sees is optimised for one tap on a phone,
outdoors, in under ten seconds. That constraint beats every other design
preference in this folder.

---

## Architecture

Multi-tenant. One Vercel project and one Supabase database serve every client.
A new client is a row in `businesses`, not a new deployment.

- Next.js 16 App Router, React 19
- Supabase Postgres with row level security
- Resend for email
- No SMS gateway. See "Why there is no Twilio" below.

### The flow

```
Job finished
  → technician opens /s/{staff_token}, enters name + email/phone
  → createReviewRequest() writes contact, job, request, and the whole message plan
  → the initial email goes out inline, before the response returns
  → customer opens /r/{token}
      → 4 or 5 stars  → /r/{token}/go → Google review page
      → 1 to 3 stars  → private feedback form → owner alerted by email
  → any rating cancels every pending message for that request
  → no rating → follow-up email on day 3 and day 7
```

A walk-up QR at `/j/{slug}` mints an anonymous request instead. It converts
well because the customer is standing there, but it carries no contact, so it
gets no follow-up. That trade is deliberate.

### The outbox is the scheduler

Every future send is written as a `messages` row at request-creation time with
a `scheduled_at`. Nothing decides later what to send. The cron handler only
asks "what is due", which means the queue is inspectable before anything goes
out and cancelling is a status flip rather than a scheduler problem.

Message statuses: `scheduled` → `ready` (texts only, waiting for a human tap)
→ `sent`, or `cancelled` / `skipped` / `failed`.

The owner digest is in the same table, as `kind = 'owner_digest'`. It is the
counterweight to tap-to-send: nothing in the ready queue moves without a human,
so the cron emails any owner with a non-empty queue once a day. Owners with an
empty queue hear nothing, deliberately. If you ever make texts send
automatically, delete the digest rather than leaving it to nag about a queue
that drains itself.

### Why there is no Twilio

The clients are United States based, where A2P 10DLC registration gates every
application-to-person SMS. Rather than carry that, texts open in the sender's
own messaging app with the number and body pre-filled, and they press send.
The message leaves from their real number over their normal plan.

Consequences to keep in mind when changing this code:

- No per-message cost and nothing to register.
- Delivery is better, because customers recognise a local number.
- We cannot observe the send. Tapping through is what marks the row sent.
- Each text costs one human tap, so the SMS chain is deliberately shorter than
  the email chain.

Outside the United States this constraint does not exist, and a gateway could
send `channel = 'sms'` rows automatically in `runFollowUps`. That is the only
place that would need to change.

### Gating

`businesses.gate_mode` is either `hard_gate` or `compliant`, and
`src/lib/review/gate.ts` is the only place the difference lives.

The current clients run `hard_gate`: only 4 and 5 star ratings ever see the
Google link. Be aware this is what Google's prohibited content policy and the
FTC's 2024 rule on consumer reviews call review suppression, and the profile
carries some risk under it. `compliant` mode shows low raters the recovery
form first and the public link afterwards, which is not suppression. Switching
a client is a one column update, by design. Do not remove that seam.

---

## Files

```
supabase/migrations/     schema, run in the Supabase SQL editor
src/app/admin/           the student's own view, onboarding and full settings
src/lib/review/          create, gate, links, draft, run-followups, business
src/lib/email/           templates and the Resend sender
src/lib/sms/             body copy and the sms: deep link builder
src/lib/supabase/        admin (service role), server (owner session), browser
src/app/r/[token]/       the customer-facing rating flow
src/app/j/[slug]/        walk-up QR target
src/app/s/[staffToken]/  technician quick-add
src/app/dashboard/       owner view, stats, tap-to-send queue, unhappy feed
src/app/api/             rate, feedback, requests, outbox, cron
```

## Three levels of access

Keep these apart. They are not tiers of one login.

| Who | How they are recognised | What they reach |
|---|---|---|
| The student, platform admin | Signed in, address listed in `ADMIN_EMAILS` | `/admin`, every client |
| A client owner | Signed in, `businesses.owner_user_id` matches, claimed on first sign-in via `owner_email` | `/dashboard`, their own business only, through row level security |
| A technician | Holds the staff link | `/s/{staff_token}`, can create review requests and nothing else |

| An end customer | Holds a request token | `/r/{token}`, one rating |

Settings follow the same split. `toBusinessPatch` drops any field the caller's
role does not own, so an owner posting `gate_mode` has it ignored rather than
rejected. Four fields are admin only, each for its own reason: the slug because
changing it kills every printed QR code, the gate mode because it is a legal
risk call the student carries rather than the client, `owner_email` because it
decides who can claim the dashboard, and `active` because it stops a paying
client's system.

`ADMIN_EMAILS` lives in the environment rather than the database on purpose. A
compromised client owner must not be able to write themselves into the admin
list. An empty list shuts the admin area for everyone, which is the correct
direction to fail.

## Rules for this folder

- The service-role client bypasses row level security. Every caller must scope
  its own query by token or business id. Never import it into a Client
  Component.
- End customers never authenticate. Their only credential is the request token,
  so tokens stay unguessable and expire.
- Never send to a contact with `opted_out_at` set or a matching `suppressions`
  row. `createReviewRequest` and `runFollowUps` both check. Keep it that way.
- `responses.acknowledged_at` is what the digest counts as outstanding. Any new
  view of unhappy customers must offer a way to clear it, or the count sticks
  and the owner stops reading the digest.
- Every silent failure gets surfaced in `checkReadiness`. A missing Google
  link, an unverified sender, an unclaimed owner: none of them throw, so a
  client can sit broken for a fortnight. If you add another setting that can
  fail quietly, add a check for it there too.
- Follow the root operator rules: no em-dashes, no emojis, plain short
  sentences, and nothing is deployed without the student's explicit approval.
