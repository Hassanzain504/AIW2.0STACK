# Review Engine

Turns a finished job into a Google review, and chases the ones who do not
answer.

A customer taps a star rating on their phone. Four or five stars go straight to
the business's Google review page with suggested wording they can copy. One to
three stars go to a private form that emails the owner within a minute, so they
can call the same day. Anyone who does not answer gets a reminder on day 3 and
day 7, and everything stops the moment they respond or opt out.

One deployment serves every client. Each client is a row in `businesses`.

---

## Setup

### 1. Supabase

Create a project, then paste `supabase/migrations/0001_initial_schema.sql`
into the SQL editor and run it.

Copy the project URL, the anon key, and the service role key from
Project Settings, API.

### 2. Resend

Create an account at resend.com and add the client's sending domain. Resend
gives you three DNS records, SPF, DKIM and DMARC, which go into the client's
DNS. Sending fails until the domain shows as verified, which usually takes
under an hour.

Until that is done, leave `from_email` null on the business and everything
sends from `DEFAULT_FROM_EMAIL` instead.

### 3. Environment

Copy `.env.example` to `.env.local` and fill it in. Generate the cron secret
with `openssl rand -hex 32`.

`NEXT_PUBLIC_APP_URL` must be the real production host once you go live. Every
review link and QR code is built from it, and links already sent do not update
if you change it later.

### 4. Add a client

```sql
insert into public.businesses (
  slug, name, google_place_id,
  from_name, from_email, reply_to_email, owner_alert_email,
  gate_mode, brand_color, timezone
) values (
  'apex-roofing', 'Apex Roofing', 'ChIJ_example_place_id',
  'Apex Roofing', 'reviews@apexroofing.com', 'office@apexroofing.com',
  'owner@apexroofing.com',
  'hard_gate', '#1d4ed8', 'America/New_York'
)
returning id, slug, staff_token;
```

`owner_alert_email` is where low ratings and the daily digest land, so it must
be an address the owner actually reads.

Set `postal_address` too if the client wants the CAN-SPAM footer. A review
request after a completed job is defensibly transactional rather than
commercial, so it is not strictly required, but it costs nothing and removes
the argument.

Take the `staff_token` from the result. The technician link is
`https://your-host/s/{staff_token}` and the walk-up QR points at
`https://your-host/j/{slug}`.

To let the owner into the dashboard, have them sign in once at
`/dashboard/login`, then attach their user:

```sql
update public.businesses
set owner_user_id = (select id from auth.users where email = 'owner@apexroofing.com')
where slug = 'apex-roofing';
```

### 5. Deploy

```
vercel --prod
```

Add every variable from `.env.example` to the Vercel project first.

---

## The cron

`vercel.json` runs `/api/cron/follow-ups` once a day. That is enough, and it
works on Vercel's free plan.

The reason a daily run is enough: the first email is sent inline by
`/api/requests` when the technician saves the job, so it never waits for the
cron. Everything the cron handles is day-based, day 3 and day 7. Nothing in
the schedule needs finer resolution than that.

Trigger it by hand while testing:

```
curl "https://your-host/api/cron/follow-ups?secret=$CRON_SECRET"
```

Each run cancels messages whose customer already answered, sends due emails,
moves due texts into the tap-to-send queue, expires stale requests, and emails
each owner whose text queue is not empty.

That last part matters. Texts do not send by themselves, so without the daily
nudge the queue just grows and the SMS half of the chain never happens. Owners
with an empty queue are not emailed, because a daily "nothing to do" message is
one people stop opening.

---

## Sending texts

There is no SMS gateway. Due texts appear in the dashboard, and tapping one
opens the phone's own messaging app with the number and text already filled
in. The owner presses send there, so the message goes from their real number.

This avoids A2P 10DLC registration entirely, costs nothing per message, and
lands better because customers recognise a local number. The cost is one tap
per text.

---

## Local development

```
npm install
npm run dev        # http://localhost:3006
npm run typecheck
npm run lint
npm run build
```

To walk the flow end to end locally, insert a business, open
`/s/{staff_token}`, log a job against an address you can read, then open the
link from the email.
