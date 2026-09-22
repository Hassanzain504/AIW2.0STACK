"""Push the latest copy onto leads that have NOT been emailed yet.
Leads already contacted are never touched: their sequence is running."""
import json, os, subprocess
CID = os.environ.get("INSTANTLY_CAMPAIGN_ID", "e1550c84-ef2f-42a9-9175-42ea109cc67a")
K = open('/home/user/.secrets/instantly_key').read().strip()

def post(path, body):
    return json.loads(subprocess.run(["curl","-sS","--max-time","90","-X","POST",
        "-H",f"Authorization: Bearer {K}","-H","Content-Type: application/json",
        "-d",json.dumps(body), f"https://api.instantly.ai/api/v2{path}"],
        capture_output=True, text=True).stdout)

rows, nxt = {}, None
while True:
    b = {"campaign": CID, "limit": 100}
    if nxt: b["starting_after"] = nxt
    r = post("/leads/list", b)
    for i in r.get("items", []): rows[i["email"].lower()] = i
    nxt = r.get("next_starting_after")
    if not nxt: break

latest = {r["email"].lower(): r for r in json.load(open('rebuilt.json'))}
sent = upd = same = miss = 0
for em, lead in rows.items():
    if lead.get("status_summary"):
        sent += 1; continue                      # already emailed, leave it alone
    new = latest.get(em)
    if not new:
        miss += 1; continue
    cur = lead.get("payload") or {}
    want = {k: new[k] for k in ("email1","subject1","email2","subject2","email3","subject3")}
    if all((cur.get(k) or "") == v for k, v in want.items()):
        same += 1; continue
    out = subprocess.run(["curl","-sS","-o","/dev/null","-w","%{http_code}","-X","PATCH",
        "--max-time","60","-H",f"Authorization: Bearer {K}","-H","Content-Type: application/json",
        "-d", json.dumps({"custom_variables": want}),
        f"https://api.instantly.ai/api/v2/leads/{lead['id']}"], capture_output=True, text=True).stdout
    if out.strip() == "200": upd += 1
print(f"already emailed, untouched : {sent}")
print(f"queued and refreshed       : {upd}")
print(f"queued, already current    : {same}")
print(f"queued, no longer approved : {miss}")
