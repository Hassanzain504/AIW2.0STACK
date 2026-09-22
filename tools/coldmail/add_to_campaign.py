"""Push any newly-rebuilt leads into the live campaign, skipping ones already there."""
import json, subprocess, os, sys
CID = "e1550c84-ef2f-42a9-9175-42ea109cc67a"
K = open('/home/user/.secrets/instantly_key').read().strip()

def api(method, path, body=None):
    cmd = ["curl","-sS","--max-time","90","-X",method,
           "-H",f"Authorization: Bearer {K}","-H","Content-Type: application/json",
           f"https://api.instantly.ai/api/v2{path}"]
    if body is not None:
        cmd += ["-d", body if isinstance(body,str) else json.dumps(body)]
    return subprocess.run(cmd, capture_output=True, text=True).stdout

def already_in_campaign():
    got, nxt = set(), None
    while True:
        b = {"campaign": CID, "limit": 100}
        if nxt: b["starting_after"] = nxt
        r = json.loads(api("POST","/leads/list", b))
        for i in r.get("items", []): got.add(i["email"].lower())
        nxt = r.get("next_starting_after")
        if not nxt: break
    return got

def campaign_rows():
    got, nxt = {}, None
    while True:
        b = {"campaign": CID, "limit": 100}
        if nxt: b["starting_after"] = nxt
        r = json.loads(api("POST","/leads/list", b))
        for i in r.get("items", []): got[i["email"].lower()] = i
        nxt = r.get("next_starting_after")
        if not nxt: break
    return got

def prune_stale(approved):
    """Remove anything live that the generator no longer approves, but never
    one that has already been emailed."""
    rows = campaign_rows()
    stale = [v for k, v in rows.items() if k not in approved]
    removed, kept = 0, []
    for s in stale:
        sent = bool(s.get("status_summary")) or (s.get("email_open_count") or 0) > 0
        if sent:
            kept.append(s["email"]); continue
        subprocess.run(["curl","-sS","-o","/dev/null","-X","DELETE","--max-time","30",
            "-H",f"Authorization: Bearer {K}",
            f"https://api.instantly.ai/api/v2/leads/{s['id']}"])
        removed += 1
    if removed: print(f"   pruned {removed} no-longer-approved leads")
    if kept:
        print(f"   LEFT IN PLACE (already emailed, cannot unsend): {len(kept)}")
        for e in kept[:8]: print(f"      {e}")
    return removed, kept

def main():
    R = json.load(open('rebuilt.json'))
    approved = {r["email"].lower() for r in R}
    prune_stale(approved)
    have = already_in_campaign()
    new = [r for r in R if r["email"].lower() not in have]
    print(f"campaign holds {len(have)};  rebuilt has {len(R)};  new to add: {len(new)}")
    if not new:
        return
    RANK = {"competitor_town":0,"no_town":1,"no_form":2,"junk":3,"tiny_site":4}
    new.sort(key=lambda r:(RANK.get((r['facts'].get('rendered') or [''])[0],9),
                           -len(r['facts'].get('rendered') or [])))
    leads = [{"email":r["email"],"first_name":r["firstName"],"company_name":r["companyName"],
              "website":r["website"],
              "custom_variables":{k:r[k] for k in ("email1","subject1","email2","subject2",
                                                   "email3","subject3")}} for r in new]
    added = 0
    for i in range(0, len(leads), 24):
        body = {"campaign_id":CID,"leads":leads[i:i+24],"skip_if_in_campaign":False,
                "skip_if_in_workspace":False,"skip_if_in_list":False}
        fn = f"/tmp/_add_{i}.json"
        json.dump(body, open(fn,"w"))
        out = subprocess.run(["curl","-sS","--max-time","120","-X","POST",
            "-H",f"Authorization: Bearer {K}","-H","Content-Type: application/json",
            "-d",f"@{fn}", f"https://api.instantly.ai/api/v2/leads/add"],
            capture_output=True, text=True).stdout
        os.remove(fn)
        try: n = json.loads(out).get("leads_uploaded", 0)
        except Exception: n = 0
        added += n
        print(f"   batch {i//24}: +{n}")
    print(f"ADDED {added}.  campaign now holds {len(already_in_campaign())}")

if __name__ == "__main__":
    main()
