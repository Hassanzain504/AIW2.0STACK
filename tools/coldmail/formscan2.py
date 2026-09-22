import asyncio, json, sys, re
from urllib.parse import urljoin, urlparse
from playwright.async_api import async_playwright

CHROME="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
GUESS = ["/contact","/contact-us","/quote","/get-a-quote","/request-a-quote","/estimate",
         "/free-estimate","/free-quote","/instant-quotes","/get-a-fast-quote","/book","/schedule"]
LINKRE = re.compile(r'contact|quote|estimate|book|schedule|appointment|get.?started|request|consult|inspection|free|claim|reach', re.I)
VENDORS = ["responsibid","wpcf7","gravity","gform","hbspt","hubspot","jotform","typeform","formstack",
           "wufoo","ninja_forms","nf-form","elementor-form","formidable","constantcontact","mailchimp",
           "tally.so","fillout","paperform","zohoforms","housecallpro","jobber","servicetitan",
           "leadperfection","calendly","acuity","gohighlevel","leadconnector","msgsndr","typeform"]
FIELD = ("input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=image]):not([type=reset])"
         ", textarea, select")
BAD_TITLE = ["just a moment","one moment","attention required","robot challenge","access denied",
             "checking your browser","403","forbidden","404","not found","error","site not found",
             "account suspended","under construction","domain for sale","bad gateway"]

async def probe(pg, url, settle=2200):
    r={"url":url,"ok":False,"status":None,"title":"","h1":"","fields":0,"ifields":0,"forms":0,"vendors":[],"err":"","links":[],"text":"","wizard":"","wizard_hint":""}
    try:
        resp=await pg.goto(url, wait_until="domcontentloaded", timeout=30000)
        r["status"]=resp.status if resp else None
        await pg.wait_for_timeout(settle)
        try:
            for _ in range(3):
                await pg.mouse.wheel(0,1500); await pg.wait_for_timeout(400)
        except Exception: pass
        r["title"]=(await pg.title() or "").strip()
        try:
            h=await pg.query_selector("h1")
            if h: r["h1"]=((await h.inner_text()) or "").strip()[:200]
        except Exception: pass
        if not r["h1"]:
            for s in ["[role=heading]",".elementor-heading-title","h2"]:
                try:
                    el=await pg.query_selector(s)
                    if el:
                        t=((await el.inner_text()) or "").strip()
                        if t: r["h1"]="~"+t[:200]; break
                except Exception: pass
        r["forms"]=len(await pg.query_selector_all("form"))
        r["fields"]=len(await pg.query_selector_all(FIELD))
        tot=0
        for fr in pg.frames:
            if fr==pg.main_frame: continue
            try: tot+=len(await fr.query_selector_all(FIELD))
            except Exception: pass
        r["ifields"]=tot
        html=(await pg.content()).lower()
        r["vendors"]=sorted({v for v in VENDORS if v in html})
        try:
            r["links"]=await pg.eval_on_selector_all("a","es=>es.map(e=>[e.href,(e.innerText||'').trim()])")
        except Exception: pass
        try: r["text"]=(await pg.inner_text("body"))[:4000]
        except Exception: r["text"]=""
        # gated/wizard form: no fields on screen but the page advertises a fill-in flow
        if r["fields"]+r["ifields"]==0 and INTENT.search(r["text"] or ""):
            for lbl in ["let's go","lets go","get started","start","begin","next","continue",
                        "get my quote","get a quote","get your quote","request a quote","book now"]:
                try:
                    el=await pg.query_selector(f"text=/^\\s*{re.escape(lbl)}\\s*/i")
                    if not el: continue
                    await el.click(timeout=4000)
                    await pg.wait_for_timeout(3000)
                    nf=len(await pg.query_selector_all(FIELD))
                    ni=0
                    for fr in pg.frames:
                        if fr==pg.main_frame: continue
                        try: ni+=len(await fr.query_selector_all(FIELD))
                        except Exception: pass
                    if nf+ni>0:
                        r["fields"],r["ifields"]=nf,ni
                        r["wizard"]=f"form appears after clicking {lbl!r}"
                    break
                except Exception: continue
            if not r.get("wizard") and INTENT.search(r["text"] or ""):
                m=INTENT.search(r["text"])
                r["wizard_hint"]=r["text"][max(0,m.start()-60):m.end()+60].replace("\n"," ")
        r["ok"]=True
    except Exception as e:
        r["err"]=str(e)[:140]
    return r

INTENT = re.compile(r"fill (it |this )?out|fill out the|takes about \\d+ seconds|request (a |your )?(free )?(quote|estimate)|get (a|your|my) (free )?(quote|estimate)|start (your|my) (quote|estimate)|book (a|your) |schedule (a|your) |tell us about|send us a message|leave (us )?(a )?(message|your details)|we will be in touch|get in touch|let.s go|get started", re.I)

def scored(r):
    tot=r["fields"]+r["ifields"]
    if r["status"] and r["status"]>=400: return False
    if tot>=3 or (tot>=1 and r["forms"]>=1) or (bool(r["vendors"]) and tot>=1): return True
    # wizard / gated form: page advertises a fill-in flow behind a button
    if r.get("wizard"): return True
    return False

async def scan(ctx, domain):
    pg=await ctx.new_page()
    out={"domain":domain,"has_form":False,"evidence":None,"checked":[],"home_title":"","home_h1":"",
         "home_status":None,"blocked":False,"err":""}
    base="https://"+domain.replace("https://","").replace("http://","").strip("/")
    try:
        home=await probe(pg,base,settle=3000)
        if not home["ok"]:
            home=await probe(pg,base.replace("https://","https://www."),settle=3000)
        out["home_title"]=home["title"]; out["home_h1"]=home["h1"]; out["home_status"]=home["status"]
        out["err"]=home["err"]
        tl=home["title"].lower()
        if (home["status"] and home["status"]>=400) or any(b in tl for b in BAD_TITLE) or not home["ok"]:
            out["blocked"]=True
        out["checked"].append({k:home[k] for k in ("url","status","fields","ifields","forms","vendors","title","wizard","wizard_hint")})
        if scored(home):
            out["has_form"]=True; out["evidence"]={k:home[k] for k in ("url","fields","ifields","forms","vendors","wizard","wizard_hint")}
        # candidate urls from the site's OWN links
        host=urlparse(base).netloc.replace("www.","")
        cands=[]
        for href,txt in home.get("links",[]):
            if not href or href.startswith(("mailto:","tel:","javascript:")): continue
            if urlparse(href).netloc.replace("www.","")!=host: continue
            if LINKRE.search(href) or LINKRE.search(txt or ""):
                u=href.split("#")[0].rstrip("/")
                if u and u not in cands: cands.append(u)
        for g in GUESS:
            u=base+g
            if u not in cands: cands.append(u)
        for u in cands[:14]:
            if out["has_form"]: break
            r=await probe(pg,u,settle=1800)
            out["checked"].append({k:r[k] for k in ("url","status","fields","ifields","forms","vendors","title","wizard","wizard_hint")})
            if scored(r):
                out["has_form"]=True; out["evidence"]={k:r[k] for k in ("url","fields","ifields","forms","vendors","wizard","wizard_hint")}
    except Exception as e:
        out["err"]=str(e)[:140]
    await pg.close()
    return out

async def main():
    doms=[l.strip() for l in open(sys.argv[1]) if l.strip()]
    outp=sys.argv[2]; conc=int(sys.argv[3]) if len(sys.argv)>3 else 5
    done=set()
    try:
        for l in open(outp):
            try: done.add(json.loads(l)["domain"])
            except Exception: pass
    except FileNotFoundError: pass
    doms=[d for d in doms if d not in done]
    print(f"to scan: {len(doms)} (skipping {len(done)} done)",flush=True)
    async with async_playwright() as pw:
        br=await pw.chromium.launch(executable_path=CHROME,args=["--no-sandbox","--disable-dev-shm-usage"])
        ctx=await br.new_context(user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",viewport={"width":1366,"height":900})
        sem=asyncio.Semaphore(conc); n=[0]
        async def run(d):
            async with sem:
                try: r=await asyncio.wait_for(scan(ctx,d),timeout=170)
                except Exception as e: r={"domain":d,"has_form":None,"err":"TIMEOUT "+str(e)[:80],"checked":[],"blocked":True,"home_title":"","home_h1":"","evidence":None}
                n[0]+=1
                with open(outp,"a") as f: f.write(json.dumps(r)+"\n")
                print(f"  {n[0]:4d}/{len(doms)} {d:36s} form={r.get('has_form')} blocked={r.get('blocked')}",flush=True)
        await asyncio.gather(*[run(d) for d in doms])
        await br.close()
asyncio.run(main())
