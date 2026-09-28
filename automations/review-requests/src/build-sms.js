// Turns Claude's reply into the final SMS. Falls back to a fixed template
// when the AI call failed, was declined, or returned something unusable.

const rec = $('Plan Actions').item.json;
const res = $json;
const step = rec._step;
const biz = rec._business;
const firstName = String(rec.customer_name || '').split(/\s+/)[0] || 'there';
const service = rec.service || 'recent service';

const TEMPLATES = {
  1: `Hi ${firstName}, thanks for choosing ${biz} for your ${service}. If you have a minute, would you share how it went in a quick Google review?`,
  2: `Hi ${firstName}, a quick reminder from ${biz}. Your honest feedback on your ${service} would really help others in the area.`,
  3: `Hi ${firstName}, last note from ${biz}. If you have 30 seconds, a short review of your ${service} would mean a lot. Thank you either way.`,
};

let text = '';
let note = '';
if (res && Array.isArray(res.content) && res.stop_reason !== 'refusal') {
  const block = res.content.find((b) => b.type === 'text');
  text = block ? String(block.text) : '';
} else {
  const err = res && res.error;
  note = 'AI unavailable: ' + String((err && (err.message || err)) || (res && res.stop_reason) || 'unknown').slice(0, 200);
}

text = text
  .replace(/https?:\/\/\S+|www\.\S+/gi, '')
  .replace(/\p{Extended_Pictographic}/gu, '')
  .replace(/\s*[\u2014\u2013]\s*/g, ', ')
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/^["']+|["']+$/g, '')
  .trim();

if (!text || text.length > 260) {
  if (!note) note = text ? 'AI text too long, template used' : 'AI text empty, template used';
  text = TEMPLATES[step];
}

// Carriers require the sender to be identified.
if (!text.toLowerCase().includes(String(biz).toLowerCase())) text = `${biz}: ${text}`;

const body = step === 1
  ? `${text}\n\n${rec._link}\n\nReply STOP to opt out.`
  : `${text}\n\n${rec._link}`;

return { json: { ...rec, _body: body, _note: note } };
