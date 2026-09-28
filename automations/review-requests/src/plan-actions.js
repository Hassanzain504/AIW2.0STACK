// Merges new form responses into the tracker and decides, per job,
// whether to send the next message, only save a change, or do nothing.

const cfg = readConfig($('Read Config').all());
if (truthy(cfg.paused)) return [];

const now = DateTime.now().setZone(cfg.timezone);
if (!now.isValid) throw new Error('Config timezone is not valid: ' + cfg.timezone);

const startHour = Number(cfg.send_start_hour);
const endHour = Number(cfg.send_end_hour);
const inSendWindow = now.hour >= startHour && now.hour < endHour;
const firstDelayHours = Number(cfg.first_delay_hours);
const followup1Days = Number(cfg.followup1_days);
const followup2Days = Number(cfg.followup2_days);
const stopOnClick = truthy(cfg.stop_on_click);
const testMode = truthy(cfg.test_mode);
const maxSends = Number(cfg.max_sends_per_run) || 20;
const ownerPhone = normPhone(cfg.owner_phone);
if (testMode && !ownerPhone) throw new Error('test_mode is on but owner_phone is empty or not a US number');

function hashId(s) {
  let h1 = 0x811c9dc5;
  let h2 = 0x9747b28c;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
    h2 = Math.imul(h2 ^ c, 2246822519) >>> 0;
  }
  return h1.toString(36).padStart(7, '0') + h2.toString(36).padStart(7, '0');
}

function pick(row, test) {
  for (const [k, v] of Object.entries(row)) {
    if (test(k.toLowerCase())) return String(v ?? '').trim();
  }
  return '';
}

// Existing tracker rows, keyed by job_id.
const tracker = new Map();
for (const it of $('Read Tracker').all()) {
  const id = String(it.json.job_id ?? '').trim();
  if (id) tracker.set(id, { ...it.json });
}

const changed = new Set();

// New form responses become tracker rows.
for (const it of $('Read Form Responses').all()) {
  const r = it.json;
  const ts = pick(r, (k) => k === 'timestamp');
  if (!ts) continue;
  const rawPhone = pick(r, (k) => k.includes('phone') || k.includes('mobile'));
  const id = hashId(ts + '|' + rawPhone);
  if (tracker.has(id)) continue;

  const phone = normPhone(rawPhone);
  const consent = pick(r, (k) => k.includes('agree') || k.includes('consent')) !== '';
  let status = 'pending';
  if (!phone) status = 'invalid_phone';
  else if (!consent) status = 'no_consent';

  tracker.set(id, {
    job_id: id,
    created_at: now.toUTC().toISO(),
    customer_name: pick(r, (k) => k.includes('customer') && k.includes('name')),
    phone: phone || rawPhone,
    service: pick(r, (k) => k.includes('service')),
    technician: pick(r, (k) => k.includes('technician')),
    notes: pick(r, (k) => k.includes('note')),
    consent: consent ? 'TRUE' : 'FALSE',
    status,
    step: 0,
    msg1_at: '', msg2_at: '', msg3_at: '',
    clicked: 'FALSE', clicked_at: '',
    reviewed: 'FALSE', opted_out: 'FALSE',
    last_message: '', last_error: '',
  });
  changed.add(id);
}

const FINAL = ['done', 'reviewed', 'opted_out', 'clicked', 'invalid_phone', 'no_consent', 'error'];

const MESSAGE_GOALS = {
  1: 'This is the first message, sent a few hours after the job was finished. Thank them for choosing the business and ask if they would share a quick Google review.',
  2: 'This is a friendly reminder sent 2 to 3 days after the first message. They have not left a review yet. Keep it shorter and lighter than a first message. Do not guilt them.',
  3: 'This is the last reminder, about a week after the job. Say this is the last note about it and thank them either way.',
};

function claudeBody(rec, step) {
  const firstName = String(rec.customer_name || '').split(/\s+/)[0] || 'there';
  const techFirst = String(rec.technician || '').split(/\s+/)[0];
  const system = [
    `You write short SMS messages for ${cfg.business_name}, a local service business in the United States.`,
    'Each message asks a customer who recently had work done to leave a Google review.',
    'Rules:',
    '- 1 or 2 sentences, under 220 characters in total.',
    '- Warm, plain, and professional. Sound like a real person at a small local business.',
    '- Use the customer first name and mention the service. Mention the technician by first name if one is given.',
    '- Include the business name.',
    '- No links, URLs, or phone numbers. A link is added after your text.',
    '- No emojis, no hashtags, no em dashes, at most one exclamation mark.',
    '- Never offer a discount, gift, or anything in exchange for a review.',
    '- Never ask for 5 stars or a positive review. Ask for honest feedback.',
    '- Output only the message text.',
  ].join('\n');
  const details = [
    `Customer first name: ${firstName}`,
    `Service: ${rec.service || 'recent service'}`,
    techFirst ? `Technician: ${techFirst}` : 'Technician: not given',
    rec.notes ? `Job notes (use at most one small detail, only if it fits naturally): ${rec.notes}` : '',
  ].filter(Boolean).join('\n');
  return {
    model: cfg.ai_model,
    max_tokens: 1500,
    output_config: { effort: 'low' },
    fallbacks: 'default',
    system,
    messages: [{ role: 'user', content: `${MESSAGE_GOALS[step]}\n\n${details}` }],
  };
}

const out = [];
let sends = 0;

for (const [id, rec] of tracker) {
  const before = JSON.stringify(rec);

  // Manual overrides typed into the sheet by the owner.
  if (truthy(rec.opted_out) && rec.status !== 'opted_out') rec.status = 'opted_out';
  else if (truthy(rec.reviewed) && !['reviewed', 'opted_out'].includes(rec.status)) rec.status = 'reviewed';
  else if (stopOnClick && truthy(rec.clicked) && !FINAL.includes(rec.status)) rec.status = 'clicked';

  const step = Number(rec.step) || 0;
  if (step >= 3 && !FINAL.includes(rec.status)) rec.status = 'done';

  let nextStep = 0;
  if (!FINAL.includes(rec.status)) {
    const created = DateTime.fromISO(String(rec.created_at));
    const msg1 = DateTime.fromISO(String(rec.msg1_at));
    if (step === 0 && created.isValid && now.diff(created, 'hours').hours >= firstDelayHours) nextStep = 1;
    else if (step === 1 && msg1.isValid && now.diff(msg1, 'days').days >= followup1Days) nextStep = 2;
    else if (step === 2 && msg1.isValid && now.diff(msg1, 'days').days >= followup2Days) nextStep = 3;
  }

  if (nextStep && inSendWindow && sends < maxSends) {
    sends++;
    out.push({
      json: {
        ...toTrackerRow(rec),
        _action: 'send',
        _step: nextStep,
        _to: testMode ? ownerPhone : rec.phone,
        _from: cfg.twilio_from_number,
        _link: `${cfg.public_base_url}/webhook/review?id=${id}`,
        _business: cfg.business_name,
        _claude_body: claudeBody(rec, nextStep),
      },
    });
  } else if (changed.has(id) || JSON.stringify(rec) !== before) {
    out.push({ json: { ...toTrackerRow(rec), _action: 'save' } });
  }
}

return out;
