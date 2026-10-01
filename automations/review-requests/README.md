# Google Review Request Automation (n8n)

Yeh ek local service business (US) ke liye automation hai. Owner apni jobs Google Sheet ke `Jobs` tab mein likhta hai. Kaam khatam hone par woh us row mein "Job completed" tick karta hai. Us ke baad system khud customer ko SMS bhejta hai jis mein Google review ka link hota hai. Agar customer review link nahi kholta to 2 din baad pehla follow-up jata hai aur 6 din baad aakhri follow-up. Is ke baad system ruk jata hai.

Volume: mahine mein 10 se 30 jobs ke liye design kiya gaya hai.

## Yeh kaise kaam karta hai

```
Google Sheet "Jobs" tab (owner "Job completed" tick karta hai)
      |
      v   (n8n, har ghante)
Workflow 1: Hourly Sender
  - nayi completed jobs "Tracker" tab mein daalta hai
  - Claude se personalized SMS likhwata hai
  - Twilio se SMS bhejta hai (sirf subah 9 se raat 8, client ke time zone mein)
  - Tracker update karta hai
      |
      v
Customer link click karta hai
      |
      v
Workflow 2: Link Click
  - Tracker mein clicked = TRUE likhta hai
  - customer ko Google review page par bhej deta hai
  - is ke baad follow-ups band ho jate hain

Customer SMS ka reply karta hai
      |
      v
Workflow 3: Inbound SMS
  - STOP likha to opted_out, us ko dobara kuch nahi jata
  - koi aur reply ho to owner ke phone par forward kar deta hai
```

Message schedule (Config tab se badla ja sakta hai):

| Message | Kab jata hai |
|---|---|
| Pehla message | Job completed tick hone ke 1 se 2 ghante baad |
| Follow-up 1 | Pehle message ke 2 din baad, agar link click nahi hua |
| Follow-up 2 (aakhri) | Pehle message ke 6 din baad, agar link click nahi hua |

## Aap se kya chahiye (checklist)

In mein se kuch cheezein client se leni hongi.

**Client se:**
- [ ] Business ka legal naam, address, website
- [ ] Google review link (Google Business Profile > "Ask for reviews" > link copy karein, `https://g.page/r/...` jaisa hota hai)
- [ ] Owner ka mobile number (customer replies aur test messages yahan aayenge)
- [ ] Time zone (masalan `America/New_York`, `America/Chicago`, `America/Denver`, `America/Los_Angeles`)
- [ ] Website par Privacy Policy, jis mein SMS ki line ho (neeche sample hai)

**Aap ke accounts:**
- [ ] Hostinger par n8n (VPS, neeche Step 1 dekhein)
- [ ] Google account (Sheet, Form, aur service account ke liye)
- [ ] Twilio account + Toll-Free number
- [ ] Anthropic API key (console.anthropic.com)

## Step 1: Hostinger par n8n

n8n ek server par hamesha chalta rehta hai, is liye isay **Hostinger VPS** chahiye.

- Agar aap ke paas **VPS (KVM 1 ya zyada)** hai: hPanel > VPS > OS & Panel > Operating System > "n8n" template select karein. Kuch minute mein n8n ready ho jayega. Is ka ek HTTPS address milega, jaise `https://srv123456.hstgr.cloud` ya aap ka apna subdomain.
- Agar aap ke paas sirf **Web Hosting / Premium / Business hosting** hai to us par n8n **nahi chalega**. Us soorat mein Hostinger KVM 1 VPS le lein (takreeban $5 se $7 per month), ya n8n Cloud use karein.

n8n ka HTTPS address note kar lein. Yeh Config tab mein `public_base_url` banega.

## Step 2: Google Sheet banayein

1. Nayi Google Sheet banayein, naam: `Review Automation - <Client Name>`.
2. Pehle tab ka naam `Tracker` rakhein. Cell A1 mein yeh line paste karein (tab se alag columns ban jayenge):

```
job_id	created_at	customer_name	phone	service	technician	notes	consent	status	step	msg1_at	msg2_at	msg3_at	clicked	clicked_at	reviewed	opted_out	last_message	last_error
```

3. Doosra tab banayein, naam `Config`. A1 mein `key` aur B1 mein `value` likhein. Phir yeh rows daalein:

| key | value (example) | Matlab |
|---|---|---|
| business_name | ABC Roofing | SMS mein yahi naam jayega |
| google_review_url | https://g.page/r/XXXX/review | Client ka Google review link |
| twilio_from_number | +18885551234 | Twilio Toll-Free number |
| public_base_url | https://srv123456.hstgr.cloud | n8n ka address |
| timezone | America/Chicago | Client ka time zone |
| owner_phone | +15551234567 | Owner ka mobile |
| send_start_hour | 9 | Is ghante se pehle SMS nahi jayega |
| send_end_hour | 20 | Is ghante ke baad SMS nahi jayega (20 = raat 8) |
| first_delay_hours | 1 | Form ke kitne ghante baad pehla SMS |
| followup1_days | 2 | Pehle SMS ke kitne din baad follow-up 1 |
| followup2_days | 6 | Pehle SMS ke kitne din baad follow-up 2 |
| stop_on_click | TRUE | Link click hote hi follow-ups band |
| ai_model | claude-opus-5 | Claude model |
| test_mode | TRUE | TRUE ho to har SMS owner_phone par jata hai, customer ko nahi |
| paused | FALSE | TRUE karein to sab kuch ruk jata hai |

Pehli 5 rows zaroori hain. Baaki khali chhod dein to default values lagti hain.

4. Browser ke URL se Sheet ID copy karein: `https://docs.google.com/spreadsheets/d/`**`YEH_WALA_HISSA`**`/edit`

## Step 3: Jobs tab banayein

Sheet mein naya tab banayein, naam **`Jobs`**. A1 mein yeh headers paste karein:

```
Job date	Customer name	Customer mobile number	Service done	Technician name	Job notes	Customer agreed to receive texts	Job completed
```

- "Customer agreed to receive texts" aur "Job completed" columns ko checkbox banayein: column select karein > Insert > Checkbox.
- Owner har job ki ek row likhta hai. Kaam khatam hone par **Job completed** tick karta hai. Agle ghante system us customer ko SMS bhej deta hai.
- Columns ka order zaroori nahi, system headers ke naam se pehchanta hai. Owner ki apni purani sheet ho to us ke headers mein bas yeh lafz hone chahiye: "customer" + "name", "phone" ya "mobile", "service", "complete" (ya "Status" column jis mein "Completed" likha ho).
- Agar consent ka column na ho to system maan leta hai ke consent invoice ya booking ke waqt liya gaya hai.
- Ek customer ki ek tareekh par ek hi review request jati hai. Isi liye "Job date" column rakhein.

US ke TCPA qanoon ke tehat customer ki ijazat ke baghair SMS bhejna risky hai. Consent column FALSE ho to SMS nahi jayega (status `no_consent`).

Client ke estimate, invoice ya booking form par bhi yeh line honi chahiye:
> By providing your mobile number, you agree to receive text messages from ABC Roofing about your service. Message and data rates may apply. Reply STOP to opt out.

## Step 4: Google Service Account (n8n ko Sheet ki access)

1. console.cloud.google.com par jayein aur naya project banayein.
2. "APIs & Services" > "Library" > **Google Sheets API** > Enable.
3. "IAM & Admin" > "Service Accounts" > "Create service account". Naam: `n8n-sheets`.
4. Service account kholein > "Keys" > "Add key" > JSON. Ek file download hogi.
5. Service account ka email copy karein (`n8n-sheets@....iam.gserviceaccount.com`).
6. Google Sheet kholein > Share > yeh email daal kar **Editor** access dein.
7. n8n mein: Credentials > Add > "Google Service Account API". Download hui JSON file se `client_email` aur `private_key` paste karein.

## Step 5: Twilio

1. twilio.com par account banayein aur balance add karein ($20 kaafi hai, mahinon chalega).
2. Phone Numbers > Buy a number > **Toll-Free** number lein.
3. Toll-Free Verification submit karein (Messaging > Regulatory Compliance). Client ki business details, website, opt-in ka tareeqa (form wali checkbox + invoice wali line), aur sample message dein:
   > ABC Roofing: Hi Sarah, thanks for choosing us for your roof repair. Would you share how it went in a quick Google review? https://... Reply STOP to opt out.
4. Approval mein 1 se 2 hafte lagte hain. Tab tak testing apne verified number par ho sakti hai.
5. Number ki settings > Messaging > "A message comes in" > Webhook > `https://<public_base_url>/webhook/twilio-inbound` > HTTP POST.
6. n8n mein: Credentials > Add > "Twilio API". Account SID aur Auth Token Twilio console se.

## Step 6: Anthropic API key

1. console.anthropic.com par key banayein aur $5 credit daalein. Is volume par yeh saal bhar chalega.
2. n8n mein: Credentials > Add > "Header Auth". Name: `x-api-key`, Value: aap ki API key.

Agar AI call fail ho jaye to system ek fixed template message bhej deta hai, taake customer ko message zaroor jaye. Aisa hone par Tracker ke `last_error` column mein wajah likhi hoti hai.

## Step 7: Workflows import karein

1. `workflows/` folder ki teeno files download karein.
2. Har file Notepad mein kholein, Find & Replace karein: `YOUR_GOOGLE_SHEET_ID` ko apni Sheet ID se badlein. Save karein.
   (Ya Sheet ID mujhe bhej dein, main files bhar kar de doonga.)
3. n8n > Workflows > "Import from File" > teeno files ek ek karke import karein.
4. Har workflow mein:
   - Har Google Sheets node kholein > Credential: "Google Service Account" select karein.
   - "Send SMS" / "Forward SMS" node > Credential: Twilio select karein.
   - "Write Message (Claude)" node > Credential: Header Auth wali select karein.
5. Teeno workflows ko **Active** kar dein (upar right mein toggle).

## Step 8: Test karein

1. Config mein `test_mode` = `TRUE`, `first_delay_hours` = `0`, `followup1_days` = `0`, `followup2_days` = `0` rakhein.
2. Jobs tab mein ek test row likhein (apna ya kisi dost ka US number) aur Job completed tick karein.
3. Workflow 1 kholein > "Execute workflow" dabayein. Owner phone par pehla SMS aana chahiye.
4. Dobara "Execute workflow" dabayein to follow-up 1 aayega, phir follow-up 2.
5. SMS ka link kholein. Google review page khulna chahiye aur Tracker mein `clicked` = `TRUE` ho jana chahiye.
6. SMS ka reply "hello" karein. Yeh owner phone par forward hona chahiye.
7. Test ke baad **Jobs aur Tracker dono** se test rows delete kar dein.
8. Config wapas set karein: `test_mode` = `FALSE`, `first_delay_hours` = `1`, `followup1_days` = `2`, `followup2_days` = `6`.

## Tracker ke status

| status | Matlab |
|---|---|
| pending | Job completed ho gayi, pehla SMS abhi nahi gaya |
| sent_1, sent_2 | Pehla message ya follow-up 1 chala gaya |
| done | Teeno messages ja chuke, system ruk gaya |
| clicked | Customer ne review link khola, follow-ups band |
| reviewed | Owner ne `reviewed` column mein TRUE likha, follow-ups band |
| opted_out | Customer ne STOP likha, dobara kuch nahi jayega |
| invalid_phone | Number US ka nahi ya ghalat hai |
| no_consent | Jobs tab mein consent tick nahi tha |
| error | SMS nahi gaya, `last_error` dekhein. Dobara try karne ke liye status `pending` (step 0) ya `sent_1` kar dein |

Owner kisi bhi customer ke `reviewed` column mein `TRUE` likh de to us customer ko follow-ups nahi jayenge.

## Zaroori baatein

- **Link click ka matlab review nahi.** System yeh maan leta hai ke jis ne link khola, woh review de raha hai. Is liye follow-up band ho jata hai. Yeh 100% pakka nahi, lekin is volume ke liye kaafi hai. Baad mein Google Business Profile API se asli reviews match kiye ja sakte hain.
- **Review gating mana hai.** Link har customer ko jata hai. Naraz customers ko rokne ka koi filter nahi lagaya gaya, kyunki Google aur FTC dono is ki ijazat nahi dete.
- **Review ke badle kuch na dein.** Discount ya gift offer karna Google policy ke khilaf hai. AI ko bhi yeh mana kiya gaya hai.
- **Messages ka waqt.** SMS sirf `send_start_hour` aur `send_end_hour` ke darmiyan jate hain.

## Monthly cost (10 jobs per month)

| Cheez | Cost |
|---|---|
| Twilio Toll-Free number | ~$2 |
| SMS (~25 messages) | ~$0.50 |
| Claude API | ~$0.10 |
| Hostinger VPS | Jo aap pehle se de rahe hain (ek VPS par kai clients chal sakte hain) |
| Google Sheet | $0 |

## Developer notes

Code nodes ka source `src/` mein hai. Workflows `node build.mjs` se generate hote hain (`SHEET_ID=... node build.mjs` Sheet ID bhi bhar deta hai). JSON files ko haath se edit karne ke bajaye `src/` badlein aur build dobara chalayein.
