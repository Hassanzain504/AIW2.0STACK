import json,re,sys,collections
from urllib.parse import urlparse, unquote
sys.path.insert(0,'.')
from junk import classify

STATES={'al','ak','az','ar','ca','co','ct','de','fl','ga','hi','id','il','in','ia','ks','ky','la',
'me','md','ma','mi','mn','ms','mo','mt','ne','nv','nh','nj','nm','ny','nc','nd','oh','ok','or','pa',
'ri','sc','sd','tn','tx','ut','vt','va','wa','wv','wi','wy','dc'}
STOP={'service','services','area','areas','location','locations','serving','region','regions',
      'roofing','roofer','roofers','roof','usa','us','city','cities','near','me','index','home',
      'contact','about','commercial','residential','repair','replacement','company','inc','llc'}

def town_from_url(u):
    p=unquote(urlparse(u).path or '').strip('/')
    segs=[s for s in p.split('/') if s]
    if not segs: return None,None
    seg=segs[-1]
    if seg.lower() in STOP or re.fullmatch(r'(service|location)[-_]?areas?',seg,re.I): 
        if len(segs)>=2: seg=segs[-2]
        else: return None,None
    seg=re.sub(r'\.(html?|php|aspx?)$','',seg,flags=re.I)
    toks=[t for t in re.split(r'[-_+.]',seg) if t]
    st=None
    toks=[t for t in toks if t]
    # trailing usa
    while toks and toks[-1].lower() in ('usa','us'): toks.pop()
    if toks and toks[-1].lower() in STATES:
        st=toks[-1].upper(); toks.pop()
    toks=[t for t in toks if t.lower() not in STOP]
    if not toks: return None,None
    name=' '.join(t.capitalize() for t in toks)
    if len(name)<3 or len(toks)>4: return None,None
    if re.fullmatch(r'[\d\s]+',name): return None,None
    return name,st

def build():
    idx=collections.defaultdict(list)
    for l in open('sitemaps.jsonl'):
        r=json.loads(l); dom=r['domain']
        j,t,p=classify(r['urls'])
        for u in t:
            name,st=town_from_url(u)
            if not name: continue
            idx[name.lower()].append({'town':name,'state':st,'domain':dom,'url':u})
    return idx

if __name__=='__main__':
    idx=build()
    json.dump({k:v for k,v in idx.items()},open('town_index.json','w'),indent=1)
    print(f"distinct towns indexed: {len(idx)}")
    print(f"total citations       : {sum(len(v) for v in idx.values())}")
    print("\n=== sample entries ===")
    for k in list(idx)[:18]:
        e=idx[k][0]
        print(f"  {e['town']:22s} {str(e['state']):4s} {e['domain']:30s} {e['url'][:60]}")
