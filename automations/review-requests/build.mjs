// Generates the importable n8n workflows in ./workflows from the Code node
// sources in ./src. Run: node build.mjs
// Optional: SHEET_ID=<google sheet id> node build.mjs  (fills the sheet id in)

import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Stable ids so rebuilding does not churn the JSON.
const uuid = (seed) => {
  const h = createHash('md5').update(seed).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
};

const dir = new URL('.', import.meta.url);
const SHEET_ID = process.env.SHEET_ID || 'YOUR_GOOGLE_SHEET_ID';
const shared = readFileSync(new URL('src/_shared.js', dir), 'utf8');
const src = (name) => shared + '\n' + readFileSync(new URL(`src/${name}.js`, dir), 'utf8');

let x = 0;
const pos = () => [(x++) * 240, 0];

const code = (name, file, mode = 'runOnceForAllItems') => ({
  name,
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: pos(),
  parameters: { mode, language: 'javaScript', jsCode: src(file) },
});

const sheet = (name, tab, operation, extra = {}) => ({
  name,
  type: 'n8n-nodes-base.googleSheets',
  typeVersion: 4.5,
  position: pos(),
  parameters: {
    authentication: 'serviceAccount',
    operation,
    documentId: { __rl: true, mode: 'id', value: SHEET_ID },
    sheetName: { __rl: true, mode: 'name', value: tab },
    ...(operation === 'read'
      ? { options: {} }
      : {
          columns: { mappingMode: 'autoMapInputData', value: {}, matchingColumns: ['job_id'], schema: [] },
          options: { cellFormat: 'RAW' },
        }),
  },
  ...extra,
});

const readOnce = { executeOnce: true, alwaysOutputData: true };

const ifEquals = (name, left, right) => ({
  name,
  type: 'n8n-nodes-base.if',
  typeVersion: 2.2,
  position: pos(),
  parameters: {
    conditions: {
      options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
      conditions: [{ id: uuid(name + left), leftValue: left, rightValue: right, operator: { type: 'string', operation: 'equals' } }],
      combinator: 'and',
    },
    options: {},
  },
});

const twilio = (name, extra = {}) => ({
  name,
  type: 'n8n-nodes-base.twilio',
  typeVersion: 1,
  position: pos(),
  parameters: { from: '={{ $json._from }}', to: '={{ $json._to }}', message: '={{ $json._body }}', options: {} },
  ...extra,
});

const webhook = (name, method, path) => ({
  name,
  type: 'n8n-nodes-base.webhook',
  typeVersion: 2,
  position: pos(),
  webhookId: uuid('webhook:' + path),
  parameters: { httpMethod: method, path, responseMode: 'responseNode', options: {} },
});

function connect(pairs) {
  const c = {};
  for (const [from, to, output = 0] of pairs) {
    c[from] ??= { main: [] };
    while (c[from].main.length <= output) c[from].main.push([]);
    c[from].main[output].push({ node: to, type: 'main', index: 0 });
  }
  return c;
}

function workflow(name, nodes, pairs) {
  nodes.forEach((n) => { n.id = uuid(name + ':' + n.name); });
  return { name, nodes, connections: connect(pairs), settings: { executionOrder: 'v1' }, pinData: {}, active: false };
}

// 1. Hourly: intake new form responses, send first message and follow-ups.
x = 0;
const wf1 = workflow('Review Requests 1 - Hourly Sender', [
  { name: 'Every Hour', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2, position: pos(),
    parameters: { rule: { interval: [{ field: 'hours', hoursInterval: 1 }] } } },
  sheet('Read Config', 'Config', 'read', readOnce),
  sheet('Read Form Responses', 'Form Responses 1', 'read', readOnce),
  sheet('Read Tracker', 'Tracker', 'read', readOnce),
  code('Plan Actions', 'plan-actions'),
  ifEquals('Needs Message?', '={{ $json._action }}', 'send'),
  {
    name: 'Write Message (Claude)',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: pos(),
    onError: 'continueRegularOutput',
    retryOnFail: true,
    maxTries: 2,
    parameters: {
      method: 'POST',
      url: 'https://api.anthropic.com/v1/messages',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      headerParameters: { parameters: [
        { name: 'anthropic-version', value: '2023-06-01' },
        { name: 'anthropic-beta', value: 'server-side-fallback-2026-07-01' },
      ] },
      sendBody: true,
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify($json._claude_body) }}',
      options: { timeout: 90000 },
    },
  },
  code('Build SMS', 'build-sms', 'runOnceForEachItem'),
  twilio('Send SMS', { onError: 'continueRegularOutput' }),
  code('Mark Sent', 'mark-sent', 'runOnceForEachItem'),
  code('Clean Row', 'clean-row', 'runOnceForEachItem'),
  sheet('Save to Tracker', 'Tracker', 'appendOrUpdate'),
], [
  ['Every Hour', 'Read Config'],
  ['Read Config', 'Read Form Responses'],
  ['Read Form Responses', 'Read Tracker'],
  ['Read Tracker', 'Plan Actions'],
  ['Plan Actions', 'Needs Message?'],
  ['Needs Message?', 'Write Message (Claude)', 0],
  ['Needs Message?', 'Clean Row', 1],
  ['Write Message (Claude)', 'Build SMS'],
  ['Build SMS', 'Send SMS'],
  ['Send SMS', 'Mark Sent'],
  ['Mark Sent', 'Clean Row'],
  ['Clean Row', 'Save to Tracker'],
]);

// 2. Tracked review link: record the click, redirect to Google.
x = 0;
const wf2 = workflow('Review Requests 2 - Link Click', [
  webhook('Link Clicked', 'GET', 'review'),
  sheet('Read Config', 'Config', 'read', { alwaysOutputData: true }),
  code('Check Click', 'check-click'),
  { name: 'Redirect to Google', type: 'n8n-nodes-base.respondToWebhook', typeVersion: 1.1, position: pos(),
    parameters: { respondWith: 'redirect', redirectURL: '={{ $json.redirect }}', options: {} } },
  ifEquals('Real Click?', '={{ String($json.record) }}', 'true'),
  code('Click Row', 'click-row', 'runOnceForEachItem'),
  sheet('Mark Clicked', 'Tracker', 'update', { onError: 'continueRegularOutput' }),
], [
  ['Link Clicked', 'Read Config'],
  ['Read Config', 'Check Click'],
  ['Check Click', 'Redirect to Google'],
  ['Redirect to Google', 'Real Click?'],
  ['Real Click?', 'Click Row', 0],
  ['Click Row', 'Mark Clicked'],
]);

// 3. Inbound SMS from Twilio: STOP / START handling, forward replies to owner.
x = 0;
const wf3 = workflow('Review Requests 3 - Inbound SMS', [
  webhook('SMS Received', 'POST', 'twilio-inbound'),
  { name: 'Reply to Twilio', type: 'n8n-nodes-base.respondToWebhook', typeVersion: 1.1, position: pos(),
    parameters: { respondWith: 'text', responseBody: '<Response></Response>',
      options: { responseHeaders: { entries: [{ name: 'Content-Type', value: 'text/xml' }] } } } },
  sheet('Read Config', 'Config', 'read', readOnce),
  sheet('Read Tracker', 'Tracker', 'read', readOnce),
  code('Handle Reply', 'handle-reply'),
  ifEquals('Forward to Owner?', '={{ $json._kind }}', 'forward'),
  twilio('Forward SMS', { onError: 'continueRegularOutput' }),
  code('Reply Row', 'reply-row', 'runOnceForEachItem'),
  sheet('Update Opt-Out', 'Tracker', 'update', { onError: 'continueRegularOutput' }),
], [
  ['SMS Received', 'Reply to Twilio'],
  ['Reply to Twilio', 'Read Config'],
  ['Read Config', 'Read Tracker'],
  ['Read Tracker', 'Handle Reply'],
  ['Handle Reply', 'Forward to Owner?'],
  ['Forward to Owner?', 'Forward SMS', 0],
  ['Forward to Owner?', 'Reply Row', 1],
  ['Reply Row', 'Update Opt-Out'],
]);

const files = {
  '01-hourly-sender.json': wf1,
  '02-link-click.json': wf2,
  '03-inbound-sms.json': wf3,
};
for (const [file, wf] of Object.entries(files)) {
  writeFileSync(new URL(`workflows/${file}`, dir), JSON.stringify(wf, null, 2) + '\n');
  console.log('wrote workflows/' + file);
}
