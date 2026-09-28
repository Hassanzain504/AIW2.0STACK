// Shared helpers. build.mjs prepends this file to every Code node.

const REQUIRED_CONFIG = ['business_name', 'google_review_url', 'twilio_from_number', 'public_base_url', 'timezone'];

const CONFIG_DEFAULTS = {
  send_start_hour: '9',
  send_end_hour: '20',
  first_delay_hours: '1',
  followup1_days: '2',
  followup2_days: '6',
  stop_on_click: 'TRUE',
  ai_model: 'claude-opus-5',
  max_sends_per_run: '20',
  paused: 'FALSE',
  test_mode: 'FALSE',
  owner_phone: '',
};

const TRACKER_COLUMNS = [
  'job_id', 'created_at', 'customer_name', 'phone', 'service', 'technician', 'notes', 'consent',
  'status', 'step', 'msg1_at', 'msg2_at', 'msg3_at', 'clicked', 'clicked_at', 'reviewed',
  'opted_out', 'last_message', 'last_error',
];

function truthy(v) {
  return ['true', 'yes', 'y', '1', 'x'].includes(String(v ?? '').trim().toLowerCase());
}

function readConfig(items) {
  const cfg = { ...CONFIG_DEFAULTS };
  for (const it of items) {
    const key = String(it.json.key ?? '').trim();
    const value = String(it.json.value ?? '').trim();
    if (key && value !== '') cfg[key] = value;
  }
  const missing = REQUIRED_CONFIG.filter((k) => !cfg[k]);
  if (missing.length) {
    throw new Error('Config tab is missing: ' + missing.join(', '));
  }
  cfg.public_base_url = cfg.public_base_url.replace(/\/+$/, '');
  return cfg;
}

function normPhone(raw) {
  const d = String(raw ?? '').replace(/\D/g, '');
  if (d.length === 10) return '+1' + d;
  if (d.length === 11 && d[0] === '1') return '+' + d;
  return '';
}

function toTrackerRow(rec) {
  const row = {};
  for (const col of TRACKER_COLUMNS) row[col] = rec[col] ?? '';
  return row;
}
