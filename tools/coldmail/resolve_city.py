import json, re, collections
try:
    from areacodes import state_of as _ac_state
except Exception:
    def _ac_state(p): return ""
ST = {"alabama":"AL","alaska":"AK","arizona":"AZ","arkansas":"AR","california":"CA","colorado":"CO",
"connecticut":"CT","delaware":"DE","florida":"FL","georgia":"GA","hawaii":"HI","idaho":"ID",
"illinois":"IL","indiana":"IN","iowa":"IA","kansas":"KS","kentucky":"KY","louisiana":"LA",
"maine":"ME","maryland":"MD","massachusetts":"MA","michigan":"MI","minnesota":"MN",
"mississippi":"MS","missouri":"MO","montana":"MT","nebraska":"NE","nevada":"NV",
"new hampshire":"NH","new jersey":"NJ","new mexico":"NM","new york":"NY","north carolina":"NC",
"north dakota":"ND","ohio":"OH","oklahoma":"OK","oregon":"OR","pennsylvania":"PA",
"rhode island":"RI","south carolina":"SC","south dakota":"SD","tennessee":"TN","texas":"TX",
"utah":"UT","vermont":"VT","virginia":"VA","washington":"WA","west virginia":"WV",
"wisconsin":"WI","wyoming":"WY"}
ABBR = sorted(set(ST.values()))
STREETY = (r"^(?:\d+\s+)?(?:[NSEW]{1,2}\.?\s+)?(?:.*?\b(?:street|avenue|ave|road|rd|drive|"
           r"lane|ln|boulevard|blvd|court|circle|cir|highway|hwy|parkway|pkwy|suite|ste|"
           r"unit|apt|floor|box|route|place|trail|trl|terrace|ter)\b\.?\s*)+")
STOP = {"the","and","home","contact","about","roofing","services","us","inc","llc","serving",
        "areas","area","service","call","email","phone","company","reviews","gallery","our team",
        "free","quote","estimate","menu","skip","content","copyright","all rights reserved"}
# if any of these appears anywhere in the candidate, it is prose, not a town
PROSE = {"the","a","an","above","below","under","over","near","around","and","with","for","from",
         "how","we","our","is","why","in","of","at","based","local",
         "book","send","scroll","know","service","areas","repair","contractors","offices",
         "operated","facilities","across","lives","company","support","choosing","licensed",
         "manager","sales","value","strong","top","king","industrial","counties","county",
         "roofing","roofer","commercial","residential","serving","proudly","trusted","best",
         "quality","free","quote","estimate","now","click","here","learn","more","read","call",
         "email","phone","hours","open","closed","today","team","staff","owner","founded",
         "since","years","experience","licensed","insured","bonded","guarantee","warranty",
         "this","that","these","those","all","any","your","you","are","was","were","been",
         "along","also","plus","including","include","such","like","etc","state","region",
         "has","served","serve","serves","been","being","having","had","does","did","will",
         "metro","greater","central","northern","southern","eastern","western","southeast",
         "northeast","southwest","northwest","area","cities","towns"}
ABBR_FIX = {"st":"St.","ft":"Ft.","mt":"Mt."}
JUNKWORD = {"average","blog","statewide","storm","damage","specialists","holds","exterior",
            "county","counties","twin","cities","news","home","page","site","map","privacy",
            "terms","policy","careers","jobs","blogs","post","posts","faq","faqs","testimonial",
            "testimonials","gallery","projects","project","financing","warranty","emco"}
STATENAMES = set(ST.keys()) | {"texas","florida","georgia","ohio","utah","iowa","maine","idaho"}
STREET_TOKEN = re.compile(r"^(dr|rd|st|ave|blvd|ln|ct|hwy|pkwy|ste|apt|unit|suite|fl)\.?$", re.I)
TAIL_GENERIC = ("area","areas","region","metro","surrounding","communities","community",
                "county","and","the","roofing","roofers","customers","residents","homeowners")

def strip_tail(raw):
    toks = raw.split()
    while toks and toks[-1].lower().strip(".,") in TAIL_GENERIC:
        toks.pop()
    return " ".join(toks)

def clean(city):
    if not city: return ""
    city = city.split("\n")[-1]
    city = re.sub(STREETY, "", city, flags=re.I).strip(" ,.-")
    city = re.sub(r"^(?:[NSEW]{1,2})\s+", "", city).strip()
    city = re.sub(r"^(?:the|serving the|serving|greater|in|near|around|all of)\s+", "", city, flags=re.I).strip()
    city = re.sub(r"\s+", " ", city)
    if not re.fullmatch(r"[A-Za-z][A-Za-z .'\-]{2,27}", city): return ""
    if city.lower() in STOP: return ""
    toks = city.split()
    # "Emco Dr. Indianapolis" -> keep only what follows the street token
    for i, t in enumerate(toks):
        if STREET_TOKEN.match(t) and i + 1 < len(toks):
            toks = toks[i+1:]
            break
    # a stray initial such as "H Grand Rapids"
    while len(toks) > 1 and len(toks[0].strip(".")) == 1:
        toks = toks[1:]
    while len(toks) > 1 and toks[-1].upper().strip(".") in ABBR:
        toks = toks[:-1]
    if not toks: return ""
    low = {t.lower().strip(".,") for t in toks}
    if low & JUNKWORD: return ""
    if len(toks) == 1 and toks[0].lower() in STATENAMES: return ""
    if len(toks) == 1 and toks[0].lower() in ("louis","petersburg","paul","charles","cloud",
                                              "joseph","augustine","pete","worth","lauderdale",
                                              "myers","wayne","collins","dodge","vernon","juliet"):
        return ""
    if "-" in " ".join(toks) and len(" ".join(toks)) > 12: return ""   # metro region, not a town
    if any(t.lower().strip(".,") in PROSE for t in toks): return ""
    # a bare compass word is not a town; "West Palm Beach" is
    if len(toks) == 1 and toks[0].lower() in ("west","east","north","south","northern","southern",
                                              "eastern","western","central"): return ""
    if len(toks) > 3: return ""
    out = []
    for p in toks:
        k = p.lower().strip(".")
        if k in ABBR_FIX: out.append(ABBR_FIX[k])
        else: out.append(p.capitalize() if (p.isupper() or p.islower()) else p)
    return " ".join(out)
def candidates(text):
    out = []
    for m in re.finditer(r"([A-Za-z][A-Za-z .'\-\n]{2,40}),\s*(" + "|".join(ABBR) + r")\b", text):
        c = clean(m.group(1))
        if c: out.append((c, m.group(2), 3))
    for name, ab in ST.items():
        pat = r"((?:[A-Z][a-zA-Z.'\-]+[ ]){0,2}[A-Z][a-zA-Z.'\-]+)[,\s]+" + name.title() + r"\b"
        for m in re.finditer(pat, text):
            c = clean(strip_tail(m.group(1)))
            if c: out.append((c, ab, 2))
    return out
SERVING = re.compile(
    r"(?:proudly\s+)?(?:[Ss]erving|SERVING|[Ll]ocated in|[Bb]ased in|[Hh]eadquartered in)\s+"
    r"(?:the\s+)?((?:[A-Z][a-zA-Z.'\-]+[ ]){0,2}[A-Z][a-zA-Z.'\-]+)")

def serving_hits(text, title):
    """A town named after 'serving' counts only if the page backs it up."""
    out = []
    tl = (title or "").lower()
    for m in SERVING.finditer(text or ""):
        raw = strip_tail(m.group(1))
        st_inside = ""
        parts = raw.split()
        # "Leavenworth Kansas" -> town Leavenworth, state KS
        if len(parts) > 1 and parts[-1].lower() in ST:
            st_inside = ST[parts[-1].lower()]
            raw = " ".join(parts[:-1])
        c = clean(raw)
        if not c or len(c) < 4: continue
        tail = (text[m.end():m.end()+26] or "")
        near_state = bool(re.match(r"\s*,?\s*(" + "|".join(ABBR) + r")\b", tail)) or \
                     bool(re.match(r"\s*,?\s*(" + "|".join(ST.keys()) + r")\b", tail, re.I))
        in_title = c.lower() in tl
        repeated = (text or "").lower().count(c.lower()) >= 3
        if st_inside or near_state or in_title or repeated:
            st = st_inside
            m2 = None if st_inside else re.match(r"\s*,?\s*(" + "|".join(ABBR) + r")\b", tail)
            if m2: st = m2.group(1)
            elif not st:
                m3 = re.match(r"\s*,?\s*(" + "|".join(ST.keys()) + r")\b", tail, re.I)
                if m3: st = ST[m3.group(1).lower()]
            out.append((c, st, 5 if st_inside else (4 if near_state else 3)))
    return out

# "<Name> Roofing" is almost always the brand, not the town. Skybird Roofing,
# Tiger Roofing, Underdog Roofing. That pattern is deliberately not here.
TITLE_PATS = [
    re.compile(r"\bRoof(?:ing|ers?)(?:\s+\w+){0,3}?\s+(?:in|of|serving)\s+"
               r"([A-Z][a-zA-Z.'\-]+(?:[ ][A-Z][a-zA-Z.'\-]+){0,2})"),
    re.compile(r"\b(?:in|serving)\s+([A-Z][a-zA-Z.'\-]+(?:[ ][A-Z][a-zA-Z.'\-]+){0,2})\s*[,|]"),
]
BRANDY = {"certainteed","gaf","owens","corning","malarkey","tamko","atlas","iko","velux",
          "premier","quality","trusted","expert","professional","affordable","reliable",
          "best","top","local","american","national","united","superior","advanced","elite"}

def title_hits(title):
    """A town printed in the page title is the strongest signal a site gives."""
    out = []
    for pat in TITLE_PATS:
        for m in pat.finditer(title or ""):
            c = clean(strip_tail(m.group(1)))
            if not c or len(c) < 4: continue
            if any(t.lower() in BRANDY for t in c.split()): continue
            out.append((c, "", 8))
    return out

def resolve(rec):
    txt = rec.get("snippet") or ""
    if not txt: return "", ""
    cands = (candidates(txt) + serving_hits(txt, rec.get("title",""))
             + title_hits(rec.get("title","")))
    if not cands: return "", ""
    score = collections.Counter(); st_of = {}
    for c, s, wgt in cands:
        score[c] += wgt; st_of.setdefault(c, s)
    title = (rec.get("title") or "").lower().replace(" ", "")
    dom = rec.get("domain","").lower()
    for c in list(score):
        k = c.lower().replace(" ", "")
        if k in title or k in dom: score[c] += 5
    best, _ = score.most_common(1)[0]
    st = st_of.get(best, "")
    if not st:
        # the state the page leans on, when one clearly dominates
        counts = {ab: len(re.findall(r"\b" + re.escape(name) + r"\b", txt, re.I))
                  for name, ab in ST.items()}
        counts = {k: v for k, v in counts.items() if v >= 3}
        if counts:
            top = sorted(counts.items(), key=lambda x: -x[1])
            if len(top) == 1 or top[0][1] >= 2 * top[1][1]:
                st = top[0][0]
    if not st:
        st = _ac_state(rec.get("phone", ""))   # their own phone number settles the state
    return best, st
if __name__ == "__main__":
    out = {}; got = 0
    for l in open("enrich.jsonl"):
        r = json.loads(l)
        c, s = resolve(r)
        if not c and r.get("city"): c, s = clean(r["city"]), r.get("state","")
        out[r["domain"]] = {"city": c, "state": s}
        if c: got += 1
    json.dump(out, open("cities_resolved.json","w"), indent=1)
    print(f"resolved a town for {got} / {len(out)} domains")
    for d in ("americanroofingkc.com","fpsroofing.com","r-jgroup.com","tridentroofsolutions.com","berkhs.com"):
        print(f"   {d:30s} -> {out.get(d)}")
