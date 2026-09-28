// Drops the routing field before writing to the sheet.

const { _kind, ...row } = $json;
return { json: row };
