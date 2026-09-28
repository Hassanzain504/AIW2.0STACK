// Tracker update for a real click.

return { json: { job_id: $json.job_id, clicked: 'TRUE', clicked_at: new Date().toISOString() } };
