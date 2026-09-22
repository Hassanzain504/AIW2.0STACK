ONES=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve',
'thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']
def w(n):
    n=int(n)
    if n<20: return ONES[n]
    if n<100:
        t,o=divmod(n,10)
        return TENS[t]+('-'+ONES[o] if o else '')
    if n<1000:
        h,r=divmod(n,100)
        s=ONES[h]+' hundred'
        return s+(' and '+w(r) if r else '')
    th,r=divmod(n,1000)
    return w(th)+' thousand'+(' '+w(r) if r else '')
