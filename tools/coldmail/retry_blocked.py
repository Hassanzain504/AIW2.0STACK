"""Patient second pass at sites that answered with a bot challenge."""
import asyncio, json, sys
from playwright.async_api import async_playwright
CHROME="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
BAD=["robot challenge","one moment","just a moment","attention required","access denied",
     "checking your browser","403","forbidden","error","not found","are you human"]
async def main():
    doms=[l.strip() for l in open('blocked.txt') if l.strip()]
    done=set()
    try:
        for l in open('retry_out.jsonl'): done.add(json.loads(l)['domain'])
    except FileNotFoundError: pass
    doms=[d for d in doms if d not in done]
    print(f"retrying {len(doms)}",flush=True)
    async with async_playwright() as pw:
        br=await pw.chromium.launch(executable_path=CHROME,args=[
            "--no-sandbox","--disable-dev-shm-usage","--disable-blink-features=AutomationControlled"])
        ctx=await br.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
            viewport={"width":1920,"height":1080}, locale="en-US", timezone_id="America/Chicago",
            extra_http_headers={"Accept-Language":"en-US,en;q=0.9","Upgrade-Insecure-Requests":"1"})
        await ctx.add_init_script(
            "Object.defineProperty(navigator,'webdriver',{get:()=>undefined});"
            "Object.defineProperty(navigator,'languages',{get:()=>['en-US','en']});"
            "Object.defineProperty(navigator,'plugins',{get:()=>[1,2,3,4,5]});")
        sem=asyncio.Semaphore(4); n=[0]
        async def one(d):
            async with sem:
                pg=await ctx.new_page(); rec={"domain":d,"ok":False,"title":"","err":""}
                for url in ("https://"+d,"https://www."+d,"http://"+d):
                    try:
                        await pg.goto(url,wait_until="domcontentloaded",timeout=45000)
                        await pg.wait_for_timeout(11000)     # sit through the challenge
                        t=(await pg.title() or "").strip()
                        if t and not any(b in t.lower() for b in BAD):
                            rec["ok"]=True; rec["title"]=t; break
                        rec["title"]=t
                    except Exception as e:
                        rec["err"]=str(e)[:90]
                await pg.close(); n[0]+=1
                with open('retry_out.jsonl','a') as f: f.write(json.dumps(rec)+"\n")
                print(f"  {n[0]:3d}/{len(doms)} {d:34s} {'RECOVERED: '+rec['title'][:40] if rec['ok'] else 'still blocked'}",flush=True)
        await asyncio.gather(*[one(d) for d in doms])
        await br.close()
    tot=sum(1 for l in open('retry_out.jsonl') if json.loads(l)['ok'])
    print(f"\nrecovered {tot} of {len(doms)+len(done)}",flush=True)
asyncio.run(main())
