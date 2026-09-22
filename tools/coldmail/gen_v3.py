"""Rebuild the roofing sequence from VERIFIED facts only, framed on revenue."""
import json, re, sys, random
sys.path.insert(0, '.')
from words import w
from junk import classify
from townindex import town_from_url

RESI = {"shingle","storm damage","insurance claims","residential","tile","cedar shake","slate"}
COMM = {"EPDM","TPO","PVC roofing","modified bitumen","built-up","low-slope","coatings","commercial"}

def load():
    L = {}
    for l in open('leads_raw.jsonl'):
        r = json.loads(l); L[r['email']] = r
    form = {}
    try:
        for l in open('scan_all.jsonl'):
            r = json.loads(l); form[r['domain']] = r
    except FileNotFoundError: pass
    enr = {}
    try:
        for l in open('enrich.jsonl'):
            r = json.loads(l); enr[r['domain']] = r
    except FileNotFoundError: pass
    sm = {}
    for l in open('sitemaps.jsonl'):
        r = json.loads(l)
        j, t, p = classify(r['urls'])
        sm[r['domain']] = {'junk': j, 'town': t, 'n_town': len(t), 'n_pages': len(p)}
    idx = json.load(open('town_index.json'))
    return L, form, enr, sm, idx

DISTINCT = {"EPDM","TPO","PVC roofing","modified bitumen","built-up","standing seam",
            "cedar shake","low-slope","coatings","sheet metal"}
def evidenced(counts):
    """A material is only read back if the site really sells it, not if the word appears once."""
    if not counts: return []
    out = []
    for name, c in counts.items():
        if name in DISTINCT and c >= 1: out.append(name)
        elif c >= 2: out.append(name)
    return out

SVC_READ = [
  ("insurance claims", "insurance work"), ("storm damage", "storm damage"),
  ("coatings", "roof coatings"),
  ("replacement", "replacement"), ("repair", "repair"), ("maintenance", "maintenance"),
  ("inspection", "inspections"), ("gutters", "gutters"), ("siding", "siding"),
  ("windows", "windows"), ("solar", "solar"),
]
def service_line(counts):
    """When the material list is thin, read back the work they actually sell."""
    strong = [(lbl, counts.get(k, 0)) for k, lbl in SVC_READ if counts.get(k, 0) >= 2]
    # one overwhelming signal makes a single supporting mention trustworthy too
    if any(n >= 5 for _, n in strong):
        strong += [(lbl, counts.get(k, 0)) for k, lbl in SVC_READ
                   if counts.get(k, 0) == 1 and lbl not in {l for l, _ in strong}]
    strong.sort(key=lambda x: -x[1])
    parts = [l for l, _ in strong][:4]
    if len(parts) >= 2:
        line = ", ".join(parts[:-1]) + " and " + parts[-1]
        return line[0].upper() + line[1:] + "."
    # only when nothing specific is evidenced: fall back to what the site shouts
    comm = counts.get("commercial", 0); resi = counts.get("residential", 0)
    if comm >= 3 and comm >= 2 * max(1, resi):
        if parts: return f"Commercial roofing and {parts[0]}."
        return "Commercial roofing."
    if comm >= 2 and resi >= 2:
        if parts: return f"Commercial and residential, {parts[0]}."
        return "Commercial and residential."
    return ""
    line = ", ".join(parts[:-1]) + " and " + parts[-1]
    return line[0].upper() + line[1:] + "."

def services_line(svcs):
    """Read their own capability list back in the trade's own words."""
    mats = [s for s in svcs if s in ("EPDM","TPO","PVC roofing","modified bitumen","built-up",
            "standing seam","metal","sheet metal","shingle","tile","slate","cedar shake","flat",
            "low-slope","coatings")]
    sec = [s for s in svcs if s in ("gutters","siding","windows","solar","skylights")]
    if len(mats) < 2:
        mats = mats + sec
    mats = mats[:6]
    if not mats: return ""
    def upfirst(x):
        return x[0].upper() + x[1:] if x else x
    if len(mats) == 1: return upfirst(mats[0]) + "."
    line = ", ".join(mats[:-1]) + " and " + mats[-1]
    return upfirst(line) + "."

HARD_COMM = {"EPDM","TPO","PVC roofing","modified bitumen","built-up","low-slope","coatings"}
def buyer_read(svcs, company):
    """Interpret the list the way somebody in the trade would.
    The commercial read must rest on actual low-slope materials, never on the word 'commercial'."""
    sv = set(svcs)
    hc = len(HARD_COMM & sv)
    r = len(RESI & sv)
    if hc >= 2 and hc >= r:
        return ("commercial",
                "That is a commercial capability list, not a residential one. The person who buys "
                "that is a facilities lead with a membrane leak, not a homeowner.")
    if hc >= 1 and r >= 1 and len(sv & (HARD_COMM | RESI)) >= 3:
        return ("both",
                "That is both halves of the trade on one list, and they are two different "
                "businesses. The residential half lives on storm work. The low-slope half lives "
                "on membrane leaks, and the two buyers do not find you the same way.")
    return ("residential", None)

HAIL = set("TX OK KS NE CO MO IA MN SD ND WY IL IN OH AR TN KY GA NC SC VA WV PA NY MI WI MT NM AL MS".split())
WIND = set("FL LA SC NC GA TX AL MS VA MD DE NJ".split())

def climate(state):
    if state in HAIL: return "hail"
    if state in WIND: return "wind"
    return "age"

def money(kind):
    return {
        "commercial": "One commercial low-slope job is worth more than a year of small repairs.",
        "both":       "One insurance replacement is twelve to eighteen thousand.",
        "residential":"One insurance replacement is twelve to eighteen thousand.",
    }[kind]

def urgency(kind, city, state, read=""):
    if not city:
        if kind == "commercial":
            return ("A facilities lead with a membrane leak does not cold-call at four in the "
                    "afternoon. He searches once and sends one email to whoever comes up.")
        return ("Somebody who has decided at nine at night does not wait until morning. They go "
                "with whoever answers first.")
    if kind == "commercial":
        return (f"A facilities lead in {city} does not cold-call at four in the afternoon. "
                "He searches once, and he sends one email to whoever comes up.")
    c = climate(state)
    echoed = "storm goes through" in (read or "")
    if c == "hail":
        if echoed:
            return (f"It is the same handful of names that get called every time, and they are the "
                    f"ones with {city} written down somewhere Google can read it.")
        return (f"That search spikes in the days after a storm goes through {city}, and it is the "
                "same few names that get called every time.")
    if c == "wind":
        if echoed:
            return (f"It is the same handful of names that get called every time, and they are the "
                    f"ones with {city} written down somewhere Google can read it.")
        return (f"That search spikes the week after a blow comes through {city}, and it is the "
                "same few names that get called every time.")
    return (f"A homeowner in {city} with a twenty year old roof does not ring round five companies. "
            "They search the name of their own town and they call whoever answers it.")

def money_line(kind, state):
    if kind == "commercial":
        return "One commercial low-slope job is worth more than a year of small repairs."
    c = climate(state)
    if c in ("hail", "wind"):
        return "One insurance replacement is twelve to eighteen thousand."
    return "One full re-roof is worth more than a year of repairs put together."

def pick_competitor(city, state, dom, idx):
    """Only cite a rival in the same state. Bellevue WA is not Bellevue TN,
    and a citation from the wrong side of the country kills the whole email."""
    if not city or not state:
        return None                      # no state, no citation. Never guess.
    for h in idx.get(city.lower()) or []:
        if h['domain'] == dom: continue
        if h.get('state') != state: continue
        return h
    return None

def build(lead, form, enr, sm, idx):
    p = lead['payload']
    dom = (p.get('website') or '').replace('https://','').replace('http://','').strip('/').lower()
    fn = (p.get('firstName') or '').strip()
    fn = re.sub(r'\s+[A-Z]\.?$', '', fn).strip()          # drop trailing middle initial
    fn = re.sub(r'\s+[A-Z]\.\s*[A-Z]\.?$', '', fn).strip()
    co = (p.get('companyName') or '').strip()
    FRANCHISE = ("paul davis","servpro","servicemaster","puroclean","restoration 1","window world",
                 "renewal by andersen","leaffilter","leaf home","west shore home","bath fitter",
                 "re-bath","roto-rooter","roto rooter","roof maxx","power home","erie home")
    if any(x in (co or "").lower() for x in FRANCHISE):
        return None, {"domain": dom}, "franchise or national brand, local businesses only"
    f = form.get(dom, {}); e = enr.get(dom, {}); s = sm.get(dom, {})
    try:
        _RES = json.load(open('cities_resolved.json'))
    except Exception:
        _RES = {}
    try:
        _OVR = json.load(open('city_overrides.json'))
    except Exception:
        _OVR = {}
    _r = _OVR.get(dom) or _RES.get(dom) or {}
    city = (_r.get('city') or '').strip()
    state = (_r.get('state') or e.get('state') or '').strip().upper()
    if city and (city.isupper() or city.islower()):
        city = ' '.join(p.capitalize() for p in city.split())
    counts = e.get('svc_counts') or {}
    svcs = evidenced(counts) if counts else (e.get('services') or [])
    year = e.get('year') or ''
    n_town = s.get('n_town', 0); n_pages = s.get('n_pages', 0)
    junk = [(u, d) for (u, d) in (s.get('junk') or [])
            if dom.replace('www.', '') in u.replace('www.', '')]
    import resolve_city as _rc
    if city and dom not in _OVR:            # a hand-checked override is trusted as written
        if not re.fullmatch(r"[A-Za-z][A-Za-z .'\-]{2,27}", city) or _rc.clean(city) != city:
            city, state = "", ""
    comp = pick_competitor(city, state, dom, idx)
    own_towns = {(town_from_url(u)[0] or '').lower() for u in (s.get('town') or [])}
    covers_own_city = bool(city) and city.lower() in own_towns

    facts = {"domain":dom,"city":city,"state":state,"services":svcs,"year":year,
             "n_town":n_town,"n_pages":n_pages,"junk":junk[:3],"competitor":comp,
             "has_form":f.get('has_form'),"blocked":f.get('blocked'),
             "title":f.get('home_title',''), "form_url":(f.get('evidence') or {}).get('url','')}

    # ---- disqualify ----
    if f.get('blocked') or f.get('has_form') is None:
        return None, facts, "site blocked or unreachable, cannot verify anything"
    ROOF_MATS = {"EPDM","TPO","PVC roofing","modified bitumen","built-up","standing seam","metal",
                 "sheet metal","shingle","tile","slate","cedar shake","flat","low-slope","coatings"}
    if not svcs:
        return None, facts, "could not read their services, no read-back possible"
    sl_mats = services_line(svcs) if (ROOF_MATS & set(svcs)) else ""
    sl_svc  = service_line(counts)
    sl = sl_mats or sl_svc
    if not sl:
        return None, facts, "nothing evidenced to read back"
    def one_item(line):
        return bool(line) and "," not in line and " and " not in line
    if one_item(sl_mats) and sl_svc and not one_item(sl_svc):
        sl = sl_svc                      # prefer the work mix over one lonely material
    if one_item(sl) and not sl.lower().startswith("commercial"):
        return None, facts, "read-back would be a single item, too thin to open on"
    facts["readback_kind"] = "materials" if sl_mats else "services"
    # a town is required only by the angles that name one
    if covers_own_city:
        comp = None
    angles = []
    if comp and city:                    angles.append(("competitor_town", 10))
    if city and n_town == 0:             angles.append(("no_town", 8))
    if city and 1 <= n_town <= 2 and n_pages >= 25:
                                         angles.append(("thin_town", 7))
    if f.get("has_form") is False:       angles.append(("no_form", 6))
    if junk:                             angles.append(("junk", 5))
    if 0 < n_pages <= 8:                 angles.append(("tiny_site", 4))
    angles.sort(key=lambda x: -x[1])
    facts["angles"] = [a for a, _ in angles]
    if covers_own_city and not angles:
        return None, facts, f"they already have a page for {city}, nothing true to criticise"
    if not angles:
        if not city:
            return None, facts, "no town and no town-free fault to name"
        return None, facts, "no verified revenue-side fault to name"

    kind, read = buyer_read(svcs, co)
    if read is None:
        c = climate(state)
        if c == "hail":
            read = ("That is a residential storm and replacement list. The search that matters "
                    "happens in the days after a storm goes through, not on a normal Tuesday.")
        elif c == "wind":
            read = ("That is a residential storm and replacement list, and in your part of the "
                    "country the whole year turns on what happens in a bad week.")
        else:
            read = ("That is a residential replacement list. Nobody buys that on impulse. They buy "
                    "it the week the roof finally stops being ignorable.")
    primary = angles[0][0]
    second = angles[1][0] if len(angles) > 1 else None
    if not sl:
        return None, facts, "no material list to read back"

    L = [f"{fn},", "", sl, "", read, "", "Which is why this one bothered me.", ""]

    # ---- the finding, revenue first ----
    def render(a):
        if a == "competitor_town":
            out = [f"Somebody in {city} needs a roofer tonight and types the name of their own "
                   "town. This is the page that answers them:", "", f"   {comp['url']}", ""]
            if n_town == 0:
                out += [f"That is {comp['domain']} holding the page for {city}. You do not have "
                        f"one, for {city} or for any other town you work in.", ""]
            else:
                if n_town == 1:
                    out += [f"That is {comp['domain']}. You have built exactly one town page, "
                            f"and it is not {city}.", ""]
                else:
                    out += [f"That is {comp['domain']}. You have {w(n_town)} town pages built and "
                            f"{city} is not one of them.", ""]
            return out
        if a == "no_town":
            return [f"Somebody in {city} needs a roofer tonight and types the name of their own "
                    f"town. Your site has {w(n_pages)} pages and not one of them says {city} "
                    "back to them.", ""]
        if a == "thin_town":
            return [f"Your site runs to {w(n_pages)} pages. Exactly "
                    f"{'one of them names' if n_town == 1 else 'two of them name'} a town you "
                    "work in.", "",
                    f"In a radius business that is the page that decides who gets the call. "
                    f"Somebody types {city}, or the suburb next to it, and whoever has written "
                    "that town down is the one they ring.", ""]
        if a == "no_form":
            return ["There is no way to start a job on your site. No form, no fields, nothing to "
                    "send at nine at night when somebody has finally had enough of the bucket in "
                    "the hallway. That lead goes to whoever has one.", ""]
        if a == "junk":
            u, desc = junk[0]
            said_count = primary in ("no_town", "thin_town", "tiny_site")
            lead_in = ("This page is live on your site:" if said_count
                       else f"Your site has {w(n_pages)} pages. One of them is:")
            return [lead_in, "", f"   {u}", "",
                    f"That is {desc}. It is in your sitemap, so it is a page Google can show, and "
                    "a homeowner comparing three roofers does notice.", ""]
        if a == "tiny_site":
            return [f"Your whole site is {w(n_pages)} pages. For a trade where the buyer is "
                    f"checking whether you are real before they call, that is thin.", ""]
        return []

    facts["rendered"] = [primary]
    L += render(primary)
    if primary in ("competitor_town", "no_town"):
        u_kind = "commercial" if kind in ("commercial", "both") else kind
        L += [urgency(u_kind, city, state, read), ""]
    TOWN_ANGLES = {"competitor_town", "no_town", "thin_town"}
    if second:
        if primary in TOWN_ANGLES and second in TOWN_ANGLES:
            second = None            # one town point per email, never two
        elif second == "tiny_site" and primary in ("no_town", "junk"):
            second = None            # page count already stated once, never say it twice
        elif second == "junk" and primary == "junk":
            second = None
    if second:
        blk = render(second)
        if blk:
            facts["rendered"].append(second)
            L += (["While I was in there:", ""] + blk) if second == "junk" else blk

    # ---- money, in jobs ----
    L += [money_line(kind, state) + " That is what this is deciding.", ""]

    L += ["I wrote the rest of it down. I would like to put it in a short document for you - "
          "completely free.", "",
          "If you can spare 15 or 20 minutes this week I will walk you through it. If a meeting "
          "is not realistic, tell me and I will send it across anyway.", "",
          "Which works better?", "", "", "Hassan", "Sent from my iPhone"]

    body = "\n".join(L)
    body = body.replace("\n\n\n\nHassan", "\x00")
    body = re.sub(r'\n{3,}', '\n\n', body)
    body = body.replace("\x00", "\n\n\nHassan")
    if city:
        subj = city.strip().lower()
    elif junk:
        subj = (junk[0][0].rstrip('/').split('/')[-1] or co).strip().lower()
    else:
        subj = co.strip().lower()
    subj = re.sub(r'\s+', ' ', subj)
    if not re.fullmatch(r"[a-z][a-z .'\-]{2,40}", subj):
        return None, facts, "could not build a clean subject line"
    return {"email1": body, "subject1": subj}, facts, None


# ---------------------------------------------------------------- follow-ups
def followups(fn, facts, kind, used_angles):
    """Email 2 and 3. Never repeat a paragraph from email 1."""
    city  = facts.get("city") or ""
    state = facts.get("state") or ""
    n_town = facts.get("n_town", 0)
    n_pages = facts.get("n_pages", 0)
    junk  = facts.get("junk") or []
    comp  = facts.get("competitor")
    noform = facts.get("has_form") is False
    rendered = facts.get("rendered") or (used_angles[:1] if used_angles else [])
    primary = rendered[0] if rendered else None
    SAMEPT = {"competitor_town", "no_town", "thin_town"}
    spent = set(rendered)                       # everything email 1 actually said is spent
    if spent & SAMEPT: spent |= SAMEPT          # the two town angles are one point
    if primary in ("no_town", "junk"): spent |= {"tiny_site"}

    # ---- email 2: a different finding, never the one email 1 led on ----
    body2 = None
    if "junk" not in spent and junk:
        u, desc = junk[0]
        body2 = [f"{fn},", "", "One more from the same pass.", "",
                 "This page is live on your site right now:", "", f"   {u}", "",
                 f"It is {desc}. On its own it sells nothing. The problem is it is in your "
                 "sitemap, so it is a page you are asking Google to show, and a homeowner "
                 "checking whether you are a real outfit can land on it.", ""]
    elif "no_form" not in spent and noform:
        body2 = [f"{fn},", "", "One more from the same pass.", "",
                 "There is no way to start a job on your site. Somebody who has decided at nine "
                 "at night has nothing to send you. They do not wait until morning. They go back "
                 "to the search and send it to whoever has a form.", ""]
    elif "no_town" not in spent and n_town == 0 and city:
        body2 = [f"{fn},", "", "One more from the same pass.", "",
                 f"There is no page on your site naming a single town you work in. In a radius "
                 f"business that is the whole game. Somebody searches their own suburb and the "
                 f"page that says it back to them takes the call.", ""]
    elif "competitor_town" not in spent and comp and n_town:
        body2 = [f"{fn},", "", "One more from the same pass.", "",
                 f"You have {w(n_town)} town pages built, so you already know this works. "
                 f"{city} just is not one of them, and {city} is where you are.", ""]
    elif "tiny_site" not in spent and 0 < n_pages <= 8:
        body2 = [f"{fn},", "", "One more from the same pass.", "",
                 f"Your whole site is {w(n_pages)} pages. For a buyer who is checking whether you "
                 "are real before they hand over a roof, that is thin.", ""]
    else:
        body2 = None

    if body2 is None:
        body2 = [f"{fn},", "",
                 "Still happy to put that document together for you.", "",
                 "No call needed if you would rather not. Say send it and it is yours.",
                 "", "", "Hassan", "Sent from my iPhone"]
        body3_only = True
    else:
        body3_only = False

    close2 = {"commercial": "One low-slope job pays for fixing all of it several times over.",
              "both":       "One replacement pays for fixing all of it several times over.",
              "residential":"One replacement pays for fixing all of it several times over."}[kind]
    if not body3_only:
        body2 += [close2, "",
                  "The document covers it. Just say send it and it is yours, no call needed.",
                  "", "", "Hassan", "Sent from my iPhone"]

    # ---- email 3: the free fix list, then stop ----
    fixes = []
    if city and n_town == 0:
        fixes.append(f"Build one page for {city} and name it in the heading, not just the footer.")
    elif city and n_town <= 2:
        fixes.append(f"You have the pages to spare. Give {city} and the two towns next to it one each.")
    elif city and comp:
        fixes.append(f"Build the {city} page. You already build them, so this is an afternoon.")
    if noform:
        fixes.append("Put three fields on the homepage - name, phone, what needs looking at.")
    if junk:
        u, _ = junk[0]
        slug = u.rstrip('/').split('/')[-1] or u
        fixes.append(f"Take /{slug} out of the sitemap, or finish the page.")
    if city and not any(city in f for f in fixes):
        fixes.append(f"Give {city} its own page with {city} in the heading.")
    if not city and len(fixes) < 2:
        fixes.append("Put the town you actually work in on the homepage, in the heading.")
    if not noform and city:
        fixes.append("Put the form on the town page too, not only on the contact page.")
    elif not noform:
        fixes.append("Put a short form on the homepage, not only on the contact page.")
    if len(fixes) < 3:
        fixes.append("Put the phone number and the town in the homepage heading, where the buyer "
                     "looks first." if city else
                     "Put the phone number and the work you do in the homepage heading, where the "
                     "buyer looks first.")
    seen = set(); uniq = []
    for f in fixes:                       # never list the same fix twice
        if f in seen: continue
        seen.add(f); uniq.append(f)
    fixes = uniq[:3]

    body3 = [f"{fn},", "", "Last one from me, then I will stop appearing in your inbox.", "",
             "Free version, no strings:", ""]
    body3 += [f"{i+1}. {t}" for i, t in enumerate(fixes)]
    body3 += ["", "That is a morning of work and it is the highest return of anything on the list.",
              "", "If you want the rest of it, and what it would take to fix properly, reply here "
              "and I will send the document.", "", "", "Hassan", "Sent from my iPhone"]

    def j(x):
        b = "\n".join(x)
        b = b.replace("\n\n\n\nHassan", "\x00")
        b = re.sub(r"\n{3,}", "\n\n", b)
        return b.replace("\x00", "\n\n\nHassan")

    return {"email2": j(body2), "subject2": "one more thing",
            "email3": j(body3), "subject3": "closing this out"}
