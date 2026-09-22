import json, re, sys, threading, queue
from urllib.parse import urlparse
import sm

JUNK = re.compile(r'/(coming-soon|comingsoon|test-?page|test\d*|new-?page|copy-of-|untitled|'
                  r'lorem|sample-page|hello-world|staging|draft|placeholder|tbd|demo|'
                  r'page-?id=\d+|\?p=\d+|index-2|home-2|blank|temp|dummy|asdf|xxx)', re.I)
TOWN = re.compile(r'/(areas?|locations?|service-?areas?|cities|city|serving|near-me|regions?)/', re.I)

doms=[l.strip() for l in open('domains.txt') if l.strip()]
done=set()
try:
    for l in open('sitemaps.jsonl'):
        try: done.add(json.loads(l)['domain'])
        except Exception: pass
except FileNotFoundError: pass
todo=[d for d in doms if d not in done]
print(f"sitemap pass: {len(todo)} to go", flush=True)
lock=threading.Lock(); q=queue.Queue(); n=[0]
for d in todo: q.put(d)
def work():
    while True:
        try: d=q.get_nowait()
        except queue.Empty: return
        try: urls=sm.crawl(d)
        except Exception: urls=[]
        junk=[u for u in urls if JUNK.search(urlparse(u).path or '')]
        town=[u for u in urls if TOWN.search(urlparse(u).path or '')]
        rec={"domain":d,"n_pages":len(urls),"junk":junk[:12],"n_town":len(town),
             "town_sample":town[:8],"urls":urls[:400]}
        with lock:
            n[0]+=1
            with open('sitemaps.jsonl','a') as f: f.write(json.dumps(rec)+"\n")
            if n[0]%25==0: print(f"  {n[0]}/{len(todo)}",flush=True)
        q.task_done()
ts=[threading.Thread(target=work,daemon=True) for _ in range(12)]
[t.start() for t in ts]; [t.join() for t in ts]
print("sitemap pass done",flush=True)
