// Reads the job id from the tracked link and filters out link-preview bots.

const cfg = readConfig($('Read Config').all());
const wh = $('Link Clicked').first().json;
const id = String((wh.query && wh.query.id) || '').trim().toLowerCase();
const ua = String((wh.headers && wh.headers['user-agent']) || '').toLowerCase();

const validId = /^[a-z0-9]{6,20}$/.test(id);
const isBot = !ua || /bot|crawler|spider|preview|facebookexternalhit|whatsapp|slack|discord|telegram|skype|curl|wget|python|headless/.test(ua);

return [{
  json: {
    redirect: cfg.google_review_url,
    record: validId && !isBot,
    job_id: validId ? id : '',
  },
}];
