import json, re, sys, collections, importlib
sys.path.insert(0,'.')
import gen_v3; importlib.reload(gen_v3)

L, form, enr, sm, idx = gen_v3.load()
out, drops = [], collections.Counter(); droplist=[]
for email, lead in L.items():
    r, facts, why = gen_v3.build(lead, form, enr, sm, idx)
    if r is None:
        drops[why]+=1; droplist.append({"email":email,"domain":facts.get("domain"),"reason":why})
        continue
    p = lead['payload']
    fn = re.sub(r'\s+[A-Z]\.?$','', (p.get('firstName') or '').strip()).strip()
    fn = re.sub(r'\s+[A-Z]\.\s*[A-Z]\.?$','', fn).strip()
    kind,_ = gen_v3.buyer_read(gen_v3.evidenced(enr.get(facts['domain'],{}).get('svc_counts') or {}) or facts['services'], p.get('companyName') or '')
    fu = gen_v3.followups(fn, facts, kind, facts.get('angles') or [])
    rec = {"email":email, "firstName":fn, "companyName":p.get('companyName'),
           "website":p.get('website'), "facts":facts}
    rec.update(r); rec.update(fu)
    out.append(rec)

json.dump(out, open('rebuilt.json','w'), indent=1)
json.dump(droplist, open('dropped.json','w'), indent=1)
print(f"REBUILT: {len(out)}   DROPPED: {sum(drops.values())}")
for k,v in drops.most_common(): print(f"   x{v:4d}  {k}")

# ---------------- QA sweep on the rebuilt copy ----------------
BAD = {
 "EM_DASH": lambda b,s: '—' in b+s,
 "EN_DASH": lambda b,s: '–' in b+s,
 "MARKDOWN": lambda b,s: '**' in b or '`' in b or re.search(r'^#{1,6} ',b,re.M),
 "HTML": lambda b,s: bool(re.search(r'<[a-z/][^>]*>',b)),
 "EMOJI": lambda b,s: bool(re.search(r'[\U0001F300-\U0001FAFF☀-➿]',b+s)),
 "SIGNOFF": lambda b,s: not b.rstrip().endswith("Hassan\nSent from my iPhone"),
 "UNRESOLVED": lambda b,s: bool(re.search(r'\{\{|\}\}|\bNone\b|\bnan\b|undefined',b+s)),
 "SCRAPER": lambda b,s: bool(re.search(r'ran a scan|i scanned|crawled|my tool|automated',b,re.I)),
 "NOFORM_UNSAFE": lambda b,s: bool(re.search(r'nothing (a|anyone).{0,30}fill in',b,re.I)),
 "HEADLINE_TECH": lambda b,s: 'headline on the page' in b.lower() or 'page title' in b.lower(),
 "DOUBLE_SPACE": lambda b,s: '  ' in re.sub(r'^ +','',b,flags=re.M),
 "TRAILING_WS": lambda b,s: bool(re.search(r'[ \t]+$',b,re.M)),
 "DUP_FIX": lambda b,s: (lambda ls: len(ls)!=len(set(ls)))(re.findall(r'^\d\. (.+)$', b, re.M)),
 "EMPTY_SLOT": lambda b,s: bool(re.search(r'\bin  +\w|for  +\w|page for \.|\bin \.', b)),
 "BANNED": lambda b,s: bool(re.search(r'leverage|synergiz|robust|seamless|game.?changer|cutting.?edge|circle back|touch base|hope this finds',b,re.I)),
}
issues=collections.Counter(); ex=collections.defaultdict(list)
def paras(b): return {x.strip() for x in b.split('\n\n') if len(x.strip())>45}
def sents(b):
    body = b.split('Hassan')[0]
    body = re.sub(r'I wrote the rest of it down.*', '', body, flags=re.S)
    out=set()
    for x in re.split(r'(?<=[.?])\s+', body):
        x=re.sub(r'\s+',' ',x).strip()
        if len(x)>40: out.add(x.lower())
    return out
rep=0; srep=0; srep_ex=[]; prep=0; prep_ex=[]
PHRASES=["storm goes through","after a blow comes through","names that get called",
         "types the name of their own town","pages","insurance replacement",
         "worth more than a year","nothing to send","radius business"]
for r in out:
    for n in (1,2,3):
        b,s=r[f'email{n}'], r[f'subject{n}']
        for k,fn_ in BAD.items():
            if fn_(b,s):
                issues[k]+=1
                if len(ex[k])<4: ex[k].append(f"{r['email']} e{n}")
    if paras(r['email1']) & paras(r['email2']): rep+=1
    if paras(r['email1']) & paras(r['email3']): rep+=1
    # sentence-level repeats, inside email1 and across the sequence
    b1=r['email1']
    inside=[x for x in sents(b1) if b1.lower().count(x)>1]
    cross=sents(b1) & sents(r['email2'])
    for ph in PHRASES:
        if b1.lower().count(ph) > 1:
            prep+=1
            if len(prep_ex)<4: prep_ex.append((r['email'],ph))
            break
    if inside or cross:
        srep+=1
        if len(srep_ex)<3: srep_ex.append((r['email'], (list(inside)+list(cross))[0][:70]))
print(f"\n=== QA SWEEP on {len(out)*3} rebuilt emails ===")
if not issues: print("   no defects found")
for k,v in issues.most_common(): print(f"   {v:5d}  {k}   e.g. {ex[k][:2]}")
print(f"   {rep:5d}  verbatim paragraph repeated across the sequence")
print(f"   {srep:5d}  sentence repeated inside email1 or between email1 and email2")
print(f"   {prep:5d}  distinctive phrase used twice in the same email")
for e,p in prep_ex: print(f"           {e}: {p!r}")
for e,x in srep_ex: print(f"           {e}: {x!r}")
subs=collections.Counter(r['subject1'] for r in out)
print(f"\n=== SUBJECT1: {len(subs)} unique across {len(out)} leads; most common: {subs.most_common(3)}")
