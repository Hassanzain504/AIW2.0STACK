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

Set `ADMIN_EMAILS` to your own address, sign in at `/dashboard/login`, then
open `/admin`.

Fill in the form and the client is created. You land on their setup page,
which lists anything still missing, sends a test email through their sender,
and hands you the two links to pass on:

- the crew link, `/s/{staff_token}`, which technicians save to their home
  screen and use to log finished jobs
- the walk-up QR, `/j/{slug}`, ready to print for the van or the invoice

Two fields decide whether the client actually works. The Google review link,
because without it a five star customer taps through to nothing. And the owner
alert email, because low ratings and the daily text reminder both go there.
The setup page marks both as blocking until they are set.

Put the owner's email in the sign-in field and they attach themselves the
first time they sign in at `/dashboard/login`. No SQL, no user ids.

Send the test email before you leave the page. An unverified Resend domain is
the most common way a new client sits silently broken, and the test is the
only thing that catches it on day one.

Everything is editable afterwards. You get the full settings page at
`/admin/{id}/settings`, and the client gets a narrower one at
`/dashboard/settings` covering their branding, addresses and how hard to
chase. Four things stay yours alone: the link name, the rating routing, who
may claim the dashboard, and whether the client is live at all.

### 5. Deploy

```
vercel --prod
```

Add every variable from `.env.example` to the Vercel project first, including
`ADMIN_EMAILS`. Leave that one empty and `/admin` stays shut for everyone,
which is the intended failure direction.

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
