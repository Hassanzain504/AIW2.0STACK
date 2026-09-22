"""Recursive sitemap crawler. Handles CDATA, nested indexes, gzip."""
import re, subprocess, gzip, io
CAND = ["/sitemap.xml","/sitemap_index.xml","/sitemap-index.xml","/wp-sitemap.xml",
        "/sitemap1.xml","/sitemap/sitemap.xml","/page-sitemap.xml"]
def fetch(url, timeout=25):
    try:
        p = subprocess.run(["curl","-sSL","--max-time",str(timeout),"-A",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
            "--compressed", url], capture_output=True, timeout=timeout+8)
        b = p.stdout
        if b[:2] == b"\x1f\x8b":
            try: b = gzip.decompress(b)
            except Exception: pass
        return b.decode("utf-8","ignore")
    except Exception:
        return ""
def locs(xml):
    xml = re.sub(r"<!\[CDATA\[(.*?)\]\]>", r"\1", xml, flags=re.S)
    return [u.strip() for u in re.findall(r"<loc>\s*(.*?)\s*</loc>", xml, re.S)]
def crawl(base, maxdepth=3, cap=1200):
    base = "https://" + base.replace("https://","").replace("http://","").strip("/")
    seen, urls, queue = set(), [], []
    rb = fetch(base + "/robots.txt", 15)
    for m in re.findall(r"(?im)^\s*sitemap:\s*(\S+)", rb or ""):
        queue.append(m)
    queue += [base + c for c in CAND]
    depth = 0
    while queue and depth < maxdepth and len(urls) < cap:
        nxt = []
        for q in queue:
            if q in seen: continue
            seen.add(q)
            xml = fetch(q)
            if "<loc" not in xml: continue
            found = locs(xml)
            if "<sitemapindex" in xml:
                nxt += [f for f in found if f not in seen]
            else:
                for f in found:
                    if f not in urls: urls.append(f)
            if len(urls) >= cap: break
        queue = nxt; depth += 1
    return urls
