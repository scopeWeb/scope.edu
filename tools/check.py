"""Browser QA: python3 tools/check.py   (needs: pip install playwright && playwright install chromium)"""
import os,re,sys,threading,http.server,socketserver,functools
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));PARENT=os.path.dirname(ROOT);NAME=os.path.basename(ROOT)
socketserver.TCPServer.allow_reuse_address=True
def serve(d,port):
    h=functools.partial(http.server.SimpleHTTPRequestHandler,directory=d);h.log_message=lambda *a:None
    s=socketserver.TCPServer(("",port),h);threading.Thread(target=s.serve_forever,daemon=True).start();return s
S1=serve(PARENT,0);S2=serve(ROOT,0);P1=S1.server_address[1];P2=S2.server_address[1]
BASE=f"http://localhost:{P1}/{NAME}/";RES=[];BAD=[]
def ok(c,m):
    RES.append((c,m));print(("PASS " if c else "FAIL ")+m)
    if not c:BAD.append(m)
PAGES=["index.html","courses/index.html"]+[f"courses/{s}/index.html" for s in["meal","office-skills","mis","data-analytics","python-sql","research"]]+["about/index.html","learn/index.html","contact/index.html","register/index.html"]
IGN=re.compile(r"fonts\.(googleapis|gstatic)")
def watch(pg,errs):
    pg.on("console",lambda m:errs.append("console:"+m.text) if m.type=="error" and not IGN.search(m.text) else None)
    pg.on("pageerror",lambda e:errs.append("pageerror:"+str(e)))
    pg.on("requestfailed",lambda r:errs.append("reqfail:"+r.url) if not IGN.search(r.url) else None)
    pg.on("response",lambda r:errs.append(f"http{r.status}:{r.url}") if r.status>=400 and not IGN.search(r.url) else None)
with sync_playwright() as p:
    b=p.chromium.launch()
    def nc(**kw):
        c=b.new_context(**kw);c.route(re.compile(r'fonts\.(googleapis|gstatic)'),lambda r:r.fulfill(status=200,content_type='text/css',body=''));return c
    for vw,vh,tag in[(1280,800,"desktop"),(375,720,"mobile")]:
        ctx=nc(viewport={"width":vw,"height":vh});pg=ctx.new_page();errs=[];watch(pg,errs)
        for u in PAGES:
            errs.clear();pg.goto(BASE+u);pg.wait_for_timeout(900)
            ok(pg.locator("h1").count()==1,f"[{tag}] {u}: exactly one h1")
            ok(pg.evaluate("document.documentElement.scrollWidth<=innerWidth+1"),f"[{tag}] {u}: no horizontal overflow (EN)")
            en=pg.inner_text("h1");pg.click(".lg") if tag=="desktop" else (pg.click(".bg"),pg.click(".lg"));pg.wait_for_timeout(300)
            ok(pg.evaluate("document.documentElement.lang")=="bn" and pg.inner_text("h1")!=en,f"[{tag}] {u}: Bangla switch rewrites content")
            ok(pg.evaluate("document.documentElement.scrollWidth<=innerWidth+1"),f"[{tag}] {u}: no horizontal overflow (BN)")
            pg.evaluate("localStorage.setItem('scope-lang','en')");pg.reload();pg.wait_for_timeout(300)
            ok(not errs,f"[{tag}] {u}: no console/page/network errors {errs[:2]}")
        ctx.close()
    ctx=nc(viewport={"width":1280,"height":800});pg=ctx.new_page();errs=[];watch(pg,errs)
    # links: every internal link resolves
    seen=set()
    for u in PAGES:
        pg.goto(BASE+u);pg.wait_for_timeout(300)
        for h in pg.eval_on_selector_all("a[href]","e=>e.map(a=>a.href)"):
            if h.startswith(BASE) and h.split("#")[0].split("?")[0] not in seen:
                seen.add(h.split("#")[0].split("?")[0]);r=pg.request.get(h.split("#")[0]);ok(r.status==200,f"link resolves: {h.replace(BASE,'')}")
    # MEAL CTA: internal registration page, same tab, old external platform link gone everywhere
    pg.goto(BASE+"courses/meal/index.html");pg.wait_for_timeout(300)
    hs=pg.eval_on_selector_all("a[href*='register/index.html?course=meal']","e=>e.map(a=>[a.href,a.target])")
    ok(len(hs)>=1 and all(h[1]=="" for h in hs),"MEAL CTA goes to internal registration page (same tab)")
    ok(all("nayeememolin" not in (pg.goto(BASE+u) and pg.content()) for u in PAGES),"old external platform link removed from every page")
    pg.goto(BASE+"courses/meal/index.html");pg.wait_for_timeout(300)
    t=pg.inner_text("body");ok("BDT 650" in t and "5 December 2026" in t and "25 November 2026" in t,"MEAL page shows confirmed facts")
    pg.goto(BASE+"courses/mis/index.html");pg.wait_for_timeout(300)
    t=pg.inner_text("body");ok("BDT 850" in t and "25 December 2026" in t and "30 December 2026" in t and "Microsoft Excel" in t and "Microsoft Power BI" in t,"MIS page shows its course facts and tool logos")
    # upcoming courses must not leak live-course facts or open paid registration
    for s in["office-skills","data-analytics","python-sql","research"]:
        pg.goto(BASE+f"courses/{s}/index.html");pg.wait_for_timeout(300);t=pg.inner_text("body")
        ok(not re.search(r"BDT|2026|nayeememolin|Registration deadline",t) and("Coming Soon" in t or "Planned" in t) and "Details will be announced" in t,f"{s}: not presented as open, no invented facts")
    # no invented contacts anywhere
    for u in PAGES:
        pg.goto(BASE+u);pg.wait_for_timeout(200);t=pg.inner_text("body")+pg.content()
        ok(not re.search(r"mailto:|tel:|[\w.]+@[\w.]+\.\w+(?!\.)",pg.inner_text("body")),f"{u}: no email/phone text")
    # catalogue search + filter + empty state
    pg.goto(BASE+"courses/index.html");pg.wait_for_timeout(300)
    ok(pg.locator("#gr .card").count()==6,"catalogue lists 6 courses")
    pg.fill("#q","zzzz");ok(pg.locator("#gr .card").count()==0 and pg.locator("#em").is_visible(),"search: empty state shows")
    pg.fill("#q","python");ok(pg.locator("#gr .card").count()==1,"search: python -> 1 result")
    pg.fill("#q","");pg.click("#fl button[data-k=data]");ok(pg.locator("#gr .card").count()==2,"filter: Data Analytics -> 2")
    pg.goto(BASE+"courses/index.html?cat=meal");pg.wait_for_timeout(300);ok(pg.locator("#gr .card").count()==1,"filter via ?cat=meal")
    # language persists across navigation
    pg.goto(BASE+"index.html");pg.wait_for_timeout(300);pg.click(".lg");pg.click("nav a:nth-child(2)");pg.wait_for_timeout(400)
    ok(pg.evaluate("document.documentElement.lang")=="bn","language persists across pages (localStorage)");pg.evaluate("localStorage.clear()")
    # form validation + honest not-connected message
    pg.goto(BASE+"register/index.html?mode=interest");pg.wait_for_timeout(300);pg.click("#rf button[type=submit]");ok(pg.inner_text("#st")!="" and pg.locator("input[aria-invalid=true]").count()>=3,"form: validation errors shown")
    pg.fill("[name=name]","Test User");pg.fill("[name=email]","a@b.co");pg.fill("[name=phone]","123");pg.check("[name=consent]");pg.click("#rf button[type=submit]");ok("not connected" in pg.inner_text("#st"),"form: honest 'not connected' status")
    # enrolment flow (bKash): steps, validation, payment details, review, submit (mocked endpoint)
    pg.goto(BASE+"register/index.html");pg.wait_for_timeout(300)
    ok(pg.locator("#ef").count()==1 and pg.locator(".stepper li").count()==3 and pg.locator(".sum").count()==1,"register: 3-step form + course summary shown")
    ok(pg.locator("fieldset[data-s='1']").is_hidden(),"register: payment step hidden at start")
    pg.click("fieldset[data-s='0'] [data-go='1']");ok(pg.locator("fieldset[data-s='0']").is_visible() and pg.locator("input[aria-invalid=true]").count()>=3,"register: step 1 blocks empty fields")
    pg.fill("[name=name]","Test User");pg.fill("[name=email]","a@b.co");pg.fill("[name=phone]","12345");pg.click("fieldset[data-s='0'] [data-go='1']")
    ok(pg.locator("fieldset[data-s='0']").is_visible(),"register: bad phone blocked")
    pg.fill("[name=phone]","+88 01712-345678");pg.click("fieldset[data-s='0'] [data-go='1']");pg.wait_for_timeout(200)
    ok(pg.locator("fieldset[data-s='1']").is_visible() and "01521407522" in pg.inner_text("#bk"),"register: payment step shows the bKash number")
    pg.click("fieldset[data-s='1'] [data-go='2']");ok(pg.locator("fieldset[data-s='1']").is_visible(),"register: payment step blocks empty TrxID")
    pg.fill("[name=sender]","01812345678");pg.fill("[name=trxid]","bad");pg.check("[name=sent]");pg.click("fieldset[data-s='1'] [data-go='2']");ok(pg.locator("fieldset[data-s='1']").is_visible(),"register: malformed TrxID blocked")
    pg.fill("[name=trxid]","9ab1c2d3e4");pg.click("fieldset[data-s='1'] [data-go='2']");pg.wait_for_timeout(200)
    rv=pg.inner_text("#rv");ok(pg.locator("fieldset[data-s='2']").is_visible() and "9AB1C2D3E4" in rv and "01712345678" in rv and "650" in rv,"register: review shows normalised phone and uppercase TrxID")
    pg.click("#go");ok(pg.locator("input[aria-invalid=true]").count()>=1,"register: review requires both confirmations")
    pg.check("[name=ok2]");pg.check("[name=consent]");pg.click("#go");ok("not connected" in pg.inner_text("#st"),"register: honest 'not connected' when no endpoint")
    posted=[]
    def route(r):
        b=r.request.post_data or "";posted.append(b)
        dup="trxid=DUPTEST000" in b
        r.fulfill(status=200,content_type="application/json",headers={"access-control-allow-origin":"*"},body='{"ok":false,"error":"duplicate_trx"}' if dup else '{"ok":true}')
    pg.route("https://example.test/**",route);pg.evaluate("SCOPE.endpoint='https://example.test/exec'")
    pg.click("[data-go='1'] >> nth=1");pg.fill("[name=trxid]","DUPTEST000");pg.click("fieldset[data-s='1'] [data-go='2']");pg.click("#go");pg.wait_for_timeout(600)
    ok(pg.locator("fieldset[data-s='1']").is_visible() and "already been used" in pg.inner_text("#st"),"register: duplicate TrxID sends student back with a clear message")
    pg.fill("[name=trxid]","9ab1c2d3e4");pg.click("fieldset[data-s='1'] [data-go='2']");pg.click("#go");pg.wait_for_timeout(700)
    bd=posted[-1];ok("type=enrol" in bd and "trxid=9AB1C2D3E4" in bd and "phone=01712345678" in bd and "amount=650" in bd and "ref=SCOPE-MEAL-" in bd,"register: payload has type, uppercase TrxID, clean phone, amount, reference")
    ok(pg.locator(".done").is_visible() and re.search(r"SCOPE-MEAL-\d{6}-[A-Z0-9]{4}",pg.inner_text(".refn")) and "pending verification" in pg.inner_text(".done"),"register: success screen shows reference and pending status")
    # language switch keeps typed data mid-form
    pg.goto(BASE+"register/index.html");pg.wait_for_timeout(300);pg.fill("[name=name]","Keep Me");pg.click(".lg");pg.wait_for_timeout(300)
    ok(pg.input_value("[name=name]")=="Keep Me","register: Bangla switch keeps what the student typed")
    pg.evaluate("localStorage.clear()")
    # both live courses share one form and update the fee/course summary
    pg.goto(BASE+"register/index.html?course=mis");pg.wait_for_timeout(300)
    ok(pg.locator("#ef").count()==1 and pg.input_value("#courseSelect")=="mis" and "850" in pg.inner_text("#courseFee"),"register: MIS opens the shared form with its fee preselected")
    pg.select_option("#courseSelect","meal");ok("650" in pg.inner_text("#courseFee") and "MEAL" in pg.inner_text("#sumCourse"),"register: course selection updates fee and summary")
    # orbit canvas: drawn, drag follows pointer, click navigates
    pg.goto(BASE+"index.html");pg.wait_for_timeout(1200)
    ok(pg.evaluate("(()=>{const c=document.getElementById('orbit'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i])n++;return n>500})()"),"orbit canvas has drawn pixels")
    bd=pg.evaluate("FX.bodies.map(b=>[b.x,b.y])");bb=pg.locator("#orbit").bounding_box();pg.evaluate("window.scrollTo(0,0)")
    best=max(range(len(bd)),key=lambda i:bd[i][0]);x0,y0=bb["x"]+bd[best][0],bb["y"]+bd[best][1]
    pg.mouse.move(x0,y0);pg.mouse.down();
    for k in range(1,11):pg.mouse.move(x0-8*k,y0+4*k);pg.wait_for_timeout(30)
    pg.wait_for_timeout(300);now=pg.evaluate(f"[FX.bodies[{best}].x,FX.bodies[{best}].y]")
    ok(abs(now[0]-(bd[best][0]-80))<60 and abs(now[1]-(bd[best][1]+40))<60,f"orbit: dragged body follows pointer (moved to {now[0]:.0f},{now[1]:.0f})")
    pg.mouse.up();pg.wait_for_timeout(300)
    sp=pg.evaluate("Math.max(...FX.bodies.map(b=>Math.hypot(b.vx,b.vy)))");ok(sp>5,f"orbit: bodies keep moving after release ({sp:.0f}px/s)")
    ok(pg.evaluate("FX.bodies.every(b=>isFinite(b.x)&&isFinite(b.y)&&b.x>=0&&b.y>=0)"),"orbit: positions finite and inside canvas")
    pg.wait_for_timeout(6000);ok(pg.evaluate("FX.bodies.every(b=>isFinite(b.x)&&b.x>0&&b.x<document.getElementById('orbit').clientWidth)"),"orbit: stable after 6s")
    ctx.close()
    # reduced motion: no loop errors, content visible
    ctx=nc(reduced_motion="reduce",viewport={"width":1280,"height":800});pg=ctx.new_page();errs=[];watch(pg,errs);pg.goto(BASE+"index.html");pg.wait_for_timeout(800)
    ok(pg.evaluate("document.documentElement.dataset.motion")=="reduced" and not errs and pg.evaluate("[...document.querySelectorAll('.rv')].every(e=>getComputedStyle(e).opacity==='1')"),"reduced motion: static, content visible, no errors")
    ctx.close()
    # JS disabled: noscript fallback
    ctx=nc(java_script_enabled=False);pg=ctx.new_page();pg.goto(BASE+"index.html");ok("nayeememolin" not in pg.content() and "facebook.com" in pg.content(),"no-JS: fallback points to Facebook, old link gone");ctx.close()
    # 404 (served from site root, like a user/org Pages site)
    ctx=nc(viewport={"width":1280,"height":800});pg=ctx.new_page();errs=[];watch(pg,errs);pg.goto(f"http://localhost:{P2}/404.html");pg.wait_for_timeout(800)
    ok(pg.locator("h1").count()==1 and not errs,f"404 page renders without errors {errs[:2]}");ctx.close()
    # contrast: every button/link text must be readable against its own background (WCAG AA 4.5)
    JS="""(()=>{const lum=c=>{const m=c.match(/[\\d.]+/g).map(Number);const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(m[0])+.7152*f(m[1])+.0722*f(m[2])};
const bgOf=e=>{while(e){const b=getComputedStyle(e).backgroundColor;if(b&&!/rgba\\(.*, 0\\)|transparent/.test(b))return b;e=e.parentElement}return 'rgb(7,21,37)'};
const bad=[];document.querySelectorAll('.btn,.badge,.chips a,.chips button,nav a,.ft a,.more').forEach(e=>{const a=lum(getComputedStyle(e).color),b=lum(bgOf(e)),r=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);if(r<4.5&&e.offsetParent)bad.push(e.className+' '+e.textContent.trim().slice(0,20)+' '+r.toFixed(1))});return bad})()"""
    ctx=nc(viewport={"width":1280,"height":800});pg=ctx.new_page()
    for u in["index.html","courses/meal/index.html","courses/index.html","contact/index.html"]:
        pg.goto(BASE+u);pg.wait_for_timeout(600);bad=pg.evaluate(JS);ok(not bad,f"contrast AA on {u} {bad[:3]}")
    ctx.close()
    # screenshots
    ctx=nc(viewport={"width":1280,"height":800});pg=ctx.new_page();pg.goto(BASE+"index.html");pg.wait_for_timeout(2500);pg.screenshot(path="/tmp/home_desktop.png")
    ctx=nc(viewport={"width":375,"height":780});pg=ctx.new_page();pg.goto(BASE+"index.html");pg.wait_for_timeout(2500);pg.screenshot(path="/tmp/home_mobile.png");b.close()
print(f"\n{len(RES)-len(BAD)}/{len(RES)} checks passed");[print("  FAILED:",m) for m in BAD];sys.exit(1 if BAD else 0)
