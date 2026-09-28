// Records the Twilio result on the tracker row.

const rec = { ...$('Build SMS').item.json };
const res = $json;
const nowIso = new Date().toISOString();

if (res && res.sid && !res.error) {
  rec['msg' + rec._step + '_at'] = nowIso;
  rec.step = rec._step;
  rec.status = rec._step >= 3 ? 'done' : 'sent_' + rec._step;
  rec.last_message = rec._body;
  rec.last_error = rec._note || '';
} else {
  const err = res && res.error;
  const msg = String((err && (err.message || err.description || err)) || JSON.stringify(res)).slice(0, 300);
  // 21610: the number replied STOP earlier, Twilio blocks further sends.
  rec.status = /21610|unsubscribed/i.test(msg) ? 'opted_out' : 'error';
  if (rec.status === 'opted_out') rec.opted_out = 'TRUE';
  rec.last_error = 'SMS failed: ' + msg;
}

return { json: toTrackerRow(rec) };
