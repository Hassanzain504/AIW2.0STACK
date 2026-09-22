import re
from urllib.parse import urlparse
ASSET = re.compile(r'\.(jpg|jpeg|png|gif|webp|svg|pdf|mp4|mov|webm|ico|css|js|zip|docx?|xlsx?)$', re.I)
JUNK_RULES = [
 (r'/coming[-_]?soon\b',            'a coming-soon page'),
 (r'/hello[-_]world\b',             'the default WordPress "Hello world!" post'),
 (r'/sample[-_]page\b',             'the default WordPress "Sample Page"'),
 (r'/new[-_]page(?:[-_]?\d*)?/?$',  'an untitled "new page"'),
 (r'/copy[-_]of[-_]',               'a page literally named "copy of" another one'),
 (r'/untitled(?:[-_]?\d*)?/?$',     'an untitled page'),
 (r'/blank(?:[-_]?\d*)?/?$',        'a blank page'),
 (r'/test[-_]page\b',               'a test page'),
 (r'/test(?:[-_]?\d*)?/?$',         'a test page'),
 (r'/testing\b',                    'a testing page'),
 (r'/test[-_](?!imonial)[a-z]',     'a test page'),
 (r'/staging\b',                    'a staging page'),
 (r'/placeholder\b',                'a placeholder page'),
 (r'/lorem',                        'a page still holding lorem ipsum'),
 (r'/dummy\b',                      'a dummy page'),
 (r'/temp(?:[-_]?\d*)?/?$',         'a temp page'),
 (r'/demo(?:[-_]?\d*)?/?$',         'a demo page'),
 (r'/home[-_]2\b',                  'a duplicate second homepage'),
 (r'/index[-_]2\b',                 'a duplicate second homepage'),
 (r'/\?p=\d+$',                     'an unnamed draft post'),
]
TOWN = re.compile(r'/(areas?|locations?|service[-_]?areas?|cities|serving|regions?)(/|$)', re.I)
def classify(urls):
    junk=[]
    for u in urls:
        p=urlparse(u).path or ''
        if ASSET.search(p): continue
        if '/testimonial' in p.lower(): continue
        for rx,desc in JUNK_RULES:
            if re.search(rx,p,re.I):
                junk.append((u,desc)); break
    town=[u for u in urls if TOWN.search(urlparse(u).path or '') and not ASSET.search(urlparse(u).path or '')]
    pages=[u for u in urls if not ASSET.search(urlparse(u).path or '')]
    return junk,town,pages
