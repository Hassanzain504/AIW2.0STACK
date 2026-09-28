// Handles a customer's SMS reply: STOP opts them out, START opts them back in
// (no more review messages are sent), anything else is forwarded to the owner.

const cfg = readConfig($('Read Config').all());
const body = $('SMS Received').first().json.body || {};
const from = normPhone(body.From);
const text = String(body.Body || '').trim();
const word = text.toLowerCase().replace(/[^a-z]/g, '');

const STOP_WORDS = ['stop', 'stopall', 'unsubscribe', 'cancel', 'end', 'quit', 'optout', 'revoke'];
const START_WORDS = ['start', 'unstop', 'yes'];

const rows = $('Read Tracker').all()
  .map((it) => it.json)
  .filter((r) => r.job_id && normPhone(r.phone) === from);

const out = [];

if (from && STOP_WORDS.includes(word)) {
  for (const r of rows) out.push({ json: { _kind: 'update', job_id: r.job_id, opted_out: 'TRUE', status: 'opted_out' } });
} else if (from && START_WORDS.includes(word)) {
  for (const r of rows) out.push({ json: { _kind: 'update', job_id: r.job_id, opted_out: 'FALSE', status: 'done' } });
} else if (text) {
  const owner = normPhone(cfg.owner_phone);
  if (owner) {
    const last = rows[rows.length - 1];
    const who = last ? `${last.customer_name} (${last.service})` : body.From;
    out.push({
      json: {
        _kind: 'forward',
        _to: owner,
        _from: cfg.twilio_from_number,
        _body: `Customer reply from ${who}, ${body.From}:\n"${text.slice(0, 400)}"`,
      },
    });
  }
}

return out;
