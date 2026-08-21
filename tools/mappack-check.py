#!/usr/bin/env python3
"""
Local map pack + review count checker.

Runs on your own machine (not in a sandbox). Sets the browser's geolocation to a
real coordinate, runs each query on Google Maps and Google Search, extracts the
ranked businesses with their ratings and review counts, and saves a screenshot of
each result for the client report.

Setup, once:
    pip install playwright
    playwright install chromium

Run:
    python tools/mappack-check.py

Edit LOCATIONS and QUERIES below for each client.
Output lands in ./mappack-output/<timestamp>/
"""

import json, os, re, sys, time
from datetime import datetime
from playwright.sync_api import sync_playwright

# ----------------------------------------------------------------------------
# Edit these two blocks per client
# ----------------------------------------------------------------------------

CLIENT = "blackopscleaningco"
TARGET_DOMAIN = "blackopscleaningco.com"
TARGET_NAME = "Black Ops Cleaning"

LOCATIONS = {
    "Rockville MD":      (39.0840, -77.1528),
    "North Bethesda MD": (39.0446, -77.1197),
    "Gaithersburg MD":   (39.1434, -77.2014),
    "Bethesda MD":       (38.9847, -77.0947),
    "Silver Spring MD":  (38.9907, -77.0261),
}

# (query, [locations to run it from])
QUERIES = [
    ("commercial cleaning",        ["Rockville MD", "Bethesda MD", "Gaithersburg MD"]),
    ("janitorial services",        ["Rockville MD", "Gaithersburg MD"]),
    ("office cleaning",            ["Rockville MD"]),
    ("biohazard cleanup",          ["Rockville MD", "Silver Spring MD"]),
    ("crime scene cleanup",        ["Rockville MD"]),
    ("unattended death cleanup",   ["Rockville MD"]),
    ("hoarding cleanup",           ["Rockville MD"]),
    ("sewage backup cleanup",      ["Rockville MD"]),
    ("medical office cleaning",    ["Rockville MD"]),
    ("post construction cleaning", ["Rockville MD"]),
]

HEADLESS = False   # keep False the first few runs so you can solve any consent screen
PAUSE = 3.5        # seconds between actions, be polite

# ----------------------------------------------------------------------------

OUT = os.path.join("mappack-output", datetime.now().strftime("%Y-%m-%d_%H%M"))
os.makedirs(OUT, exist_ok=True)

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def parse_maps(page):
    """Pull ranked businesses with rating and review count out of the Maps list."""
    js = """
    () => {
      const out = [];
      const cards = document.querySelectorAll('div[role="feed"] > div > div[jsaction]');
      cards.forEach(c => {
        const name = c.querySelector('.fontHeadlineSmall')?.textContent?.trim();
        if (!name) return;
        const aria = c.querySelector('span[role="img"][aria-label*="star"]')?.getAttribute('aria-label') || '';
        const m = aria.match(/([\\d.]+)\\s*stars?,?\\s*([\\d,]+)\\s*review/i);
        const link = c.querySelector('a[href*="/maps/place/"]')?.href || '';
        const site = Array.from(c.querySelectorAll('a')).map(a=>a.href)
                       .find(h => h && !h.includes('google.com')) || '';
        out.push({
          name,
          rating: m ? parseFloat(m[1]) : null,
          reviews: m ? parseInt(m[2].replace(/,/g,'')) : null,
          website: site,
          maps_url: link
        });
      });
      return out;
    }
    """
    try:
        return page.evaluate(js)
    except Exception as e:
        print(f"      parse error: {e}")
        return []


def run():
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS)
        for query, locs in QUERIES:
            for loc_name in locs:
                if loc_name not in LOCATIONS:
                    print(f"  ! unknown location {loc_name}, skipping")
                    continue
                lat, lon = LOCATIONS[loc_name]
                tag = f"{slug(query)}__{slug(loc_name)}"
                print(f"\n>> {query}  @  {loc_name}")

                ctx = browser.new_context(
                    geolocation={"latitude": lat, "longitude": lon},
                    permissions=["geolocation"],
                    locale="en-US", timezone_id="America/New_York",
                    viewport={"width": 1440, "height": 1000},
                    user_agent=UA,
                )
                page = ctx.new_page()

                # --- Google Maps: the ranked list with review counts ---
                maps_url = (f"https://www.google.com/maps/search/{query.replace(' ','+')}"
                            f"/@{lat},{lon},13z?hl=en")
                try:
                    page.goto(maps_url, timeout=60000)
                    page.wait_for_timeout(int(PAUSE * 1000))
                    try:
                        page.wait_for_selector('div[role="feed"]', timeout=15000)
                    except Exception:
                        pass
                    page.wait_for_timeout(1500)
                    biz = parse_maps(page)
                    page.screenshot(path=os.path.join(OUT, f"maps__{tag}.png"), full_page=False)
                except Exception as e:
                    print(f"   maps failed: {str(e)[:90]}")
                    biz = []

                found_at = None
                for i, b in enumerate(biz, 1):
                    hay = (b.get("name","") + " " + (b.get("website") or "")).lower()
                    if TARGET_DOMAIN in hay or TARGET_NAME.lower() in hay:
                        found_at = i
                        break

                print(f"   {len(biz)} businesses listed | {TARGET_NAME}: "
                      f"{'#'+str(found_at) if found_at else 'not listed'}")
                for i, b in enumerate(biz[:5], 1):
                    r = f"{b['rating']} ({b['reviews']})" if b['reviews'] is not None else "no reviews"
                    print(f"      {i}. {b['name'][:44]:46} {r}")

                # --- Google Search: the actual 3-pack the customer sees ---
                try:
                    page.goto("https://www.google.com/search?q="
                              + f"{query} {loc_name}".replace(" ", "+") + "&hl=en&gl=us",
                              timeout=60000)
                    page.wait_for_timeout(int(PAUSE * 1000))
                    page.screenshot(path=os.path.join(OUT, f"serp__{tag}.png"), full_page=False)
                except Exception as e:
                    print(f"   serp failed: {str(e)[:90]}")

                results.append({
                    "query": query,
                    "location": loc_name,
                    "coords": [lat, lon],
                    "target_position": found_at,
                    "businesses": biz,
                })
                ctx.close()
                time.sleep(PAUSE)

        browser.close()

    with open(os.path.join(OUT, "results.json"), "w") as f:
        json.dump(results, f, indent=2)

    # flat CSV for the spreadsheet
    with open(os.path.join(OUT, "results.csv"), "w") as f:
        f.write("query,location,position,business,rating,reviews,website\n")
        for r in results:
            for i, b in enumerate(r["businesses"], 1):
                name = (b["name"] or "").replace('"', "'")
                f.write(f'"{r["query"]}","{r["location"]}",{i},"{name}",'
                        f'{b["rating"] or ""},{b["reviews"] or ""},"{b["website"] or ""}"\n')

    print(f"\nDone. Screenshots, results.json and results.csv are in:\n  {OUT}\n")
    print("Send me results.csv and I will work out the review target per keyword.")


if __name__ == "__main__":
    run()
