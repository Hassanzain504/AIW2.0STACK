import asyncio, json, sys, re
from playwright.async_api import async_playwright
CHROME="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

SERVICES = [
 ("EPDM", r"\bEPDM\b"), ("TPO", r"\bTPO\b"), ("PVC roofing", r"\bPVC\b"),
 ("modified bitumen", r"modified bitumen|mod[- ]bit"), ("built-up", r"built[- ]up roof|\bBUR\b"),
 ("standing seam", r"standing seam"), ("metal", r"\bmetal roof|metal roofing"),
 ("sheet metal", r"sheet metal"), ("shingle", r"shingle|asphalt roof"),
 ("tile", r"\btile roof|clay tile|concrete tile"), ("slate", r"\bslate roof|slate\b"),
 ("cedar shake", r"cedar shake|wood shake"), ("flat", r"\bflat roof"),
 ("low-slope", r"low[- ]slope"), ("coatings", r"roof coating|silicone coating|elastomeric"),
 ("gutters", r"\bgutter"), ("siding", r"\bsiding\b"), ("windows", r"\bwindow replacement|\bwindows\b"),
 ("solar", r"\bsolar\b"), ("skylights", r"skylight"),
 ("storm damage", r"storm damage|hail damage|wind damage"),
 ("insurance claims", r"insurance claim|insurance restoration"),
 ("commercial", r"\bcommercial\b"), ("residential", r"\bresidential\b"),
 ("repair", r"roof repair"), ("replacement", r"roof replacement|re[- ]?roof"),
 ("inspection", r"roof inspection"), ("maintenance", r"roof maintenance"),
]
YEAR = re.compile(r"(?:since|est\.?|established|serving[^.]{0,40}since|family owned since|in business since)\s*(?:in\s*)?((?:19|20)\d{2})", re.I)
FAMILY = re.compile(r"family[- ]owned|family owned and operated|family business|third generation|second generation|3rd generation|2nd generation", re.I)
LICENCE = re.compile(r"(?:lic(?:ense|ence)?\.?\s*#?\s*|CCC|CGC|RC-?|CSLB\s*#?\s*)([A-Z0-9\-]{5,15})", re.I)
PHONE = re.compile(r"\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b")
ST = ("AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ "
      "NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC").split()
ADDR = re.compile(r"([A-Z][A-Za-z.'\-]+(?:\s+[A-Z][A-Za-z.'\-]+){0,2}),\s*(" + "|".join(ST) + r")\b\s*(\d{5})?")
def cities(txt):
    out = []
    for m in ADDR.finditer(txt or ""):
        city, st, zp = m.group(1).strip(), m.group(2), m.group(3)
        if len(city) < 3: continue
        cl = city.lower()
        if cl in ("the","and","in","of","suite","ste","po box","box","inc","llc","copyright"): continue
        if re.search(r"[\d\n]", city): continue
        if re.search(r"\b(suite|ste|floor|unit|apt|po|box|building|bldg|hwy|road|rd|street|st|ave|avenue|blvd|drive|dr|lane|ln|way|court|ct|parkway|pkwy|north|south|east|west)\b", cl): continue
        if not re.fullmatch(r"[A-Za-z][A-Za-z .'\-]{2,27}", city): continue
        out.append((city, st, zp or ""))
    return out

async def grab(pg, url):
    try:
        r = await pg.goto(url, wait_until="domcontentloaded", timeout=28000)
        await pg.wait_for_timeout(2200)
        for _ in range(4):
            await pg.mouse.wheel(0, 1400); await pg.wait_for_timeout(300)
        txt = await pg.inner_text("body")
        title = (await pg.title() or "").strip()
        h1 = ""
        try:
            e = await pg.query_selector("h1")
            if e: h1 = ((await e.inner_text()) or "").strip()[:200]
        except Exception: pass
        nav = []
        try:
            nav = await pg.eval_on_selector_all("nav a, header a", "es=>es.map(e=>(e.innerText||'').trim()).filter(Boolean)")
        except Exception: pass
        return {"status": r.status if r else None, "text": txt[:20000], "title": title, "h1": h1, "nav": nav[:60]}
    except Exception as e:
        return {"status": None, "text": "", "title": "", "h1": "", "nav": [], "err": str(e)[:110]}

async def one(ctx, dom, extra):
    pg = await ctx.new_page()
    base = "https://" + dom.replace("https://","").replace("http://","").strip("/")
    out = {"domain": dom, "services": [], "svc_counts": {}, "year": "", "family": False,
           "licence": "", "phone": "", "title": "", "h1": "", "nav": [], "err": "",
           "cities": [], "city": "", "state": "", "snippet": ""}
    blob = ""
    try:
        h = await grab(pg, base)
        out["title"], out["h1"], out["nav"] = h["title"], h["h1"], h["nav"]
        blob += " " + h["text"]
        out["err"] = h.get("err","")
        for u in extra[:2]:
            g = await grab(pg, u)
            blob += " " + g["text"]
        low = blob
        counts = {}
        for n, rx in SERVICES:
            c = len(re.findall(rx, low, re.I))
            if c: counts[n] = c
        out["svc_counts"] = counts
        out["services"] = list(counts.keys())
        m = YEAR.search(low);      out["year"] = m.group(1) if m else ""
        out["family"] = bool(FAMILY.search(low))
        m = LICENCE.search(low);   out["licence"] = m.group(0)[:24] if m else ""
        m = PHONE.search(low);     out["phone"] = m.group(0) if m else ""
        cs = cities(low)
        from collections import Counter
        if cs:
            cnt = Counter((c, s_) for c, s_, _ in cs)
            (bc, bs), _ = cnt.most_common(1)[0]
            out["city"], out["state"] = bc, bs
            out["cities"] = [list(x) for x in cnt.most_common(8)]
        out["snippet"] = re.sub(r"[ \t]+", " ", blob)[:9000]
    except Exception as e:
        out["err"] = str(e)[:110]
    await pg.close()
    return out

async def main():
    sitemaps = {}
    try:
        for l in open("sitemaps.jsonl"):
            r = json.loads(l); sitemaps[r["domain"]] = r
    except FileNotFoundError: pass
    doms = [l.strip() for l in open("domains.txt") if l.strip()]
    outp = "enrich.jsonl"
    done = set()
    try:
        for l in open(outp):
            try: done.add(json.loads(l)["domain"])
            except Exception: pass
    except FileNotFoundError: pass
    doms = [d for d in doms if d not in done]
    print(f"enrich: {len(doms)} to go", flush=True)
    async with async_playwright() as pw:
        br = await pw.chromium.launch(executable_path=CHROME, args=["--no-sandbox","--disable-dev-shm-usage"])
        ctx = await br.new_context(user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", viewport={"width":1366,"height":900})
        sem = asyncio.Semaphore(5); n=[0]
        async def run(d):
            sm_ = sitemaps.get(d, {})
            extra = [u for u in sm_.get("urls", []) if re.search(r"/(services|about|roofing)", u, re.I)][:2]
            async with sem:
                try: r = await asyncio.wait_for(one(ctx, d, extra), timeout=150)
                except Exception as e: r = {"domain": d, "err": "TIMEOUT "+str(e)[:60], "services": [], "year":"", "family":False, "licence":"", "phone":"", "title":"", "h1":"", "nav":[], "cities":[], "city":"", "state":"", "svc_counts":{}, "snippet":""}
                n[0]+=1
                with open(outp,"a") as f: f.write(json.dumps(r)+"\n")
                if n[0] % 20 == 0: print(f"  {n[0]}/{len(doms)}", flush=True)
        await asyncio.gather(*[run(d) for d in doms])
        await br.close()
    print("enrich done", flush=True)
asyncio.run(main())
