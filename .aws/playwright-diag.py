"""Diagnostic: navigate to the live site, capture all console output + errors + DOM state."""
from playwright.sync_api import sync_playwright

URL = "http://transline-web-only-248358863034.s3-website-us-east-1.amazonaws.com/"

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": 390, "height": 844})
    page = ctx.new_page()
    events = []
    page.on("console", lambda m: events.append(("console:" + m.type, m.text)))
    page.on("pageerror", lambda e: events.append(("pageerror", str(e))))
    page.on("requestfailed", lambda r: events.append(("requestfailed", f"{r.url} {r.failure}")))

    page.goto(URL, wait_until="domcontentloaded", timeout=30000)
    # Wait for either .tl-shell to appear OR a timeout
    try:
        page.wait_for_selector(".tl-shell", timeout=10000)
        print("SHELL FOUND")
    except Exception as e:
        print(f"SHELL NOT FOUND: {e}")

    page.wait_for_timeout(2500)

    # DOM state
    info = page.evaluate("""() => {
        return {
            title: document.title,
            bodyChildren: Array.from(document.body.children).map(c => ({
                tag: c.tagName,
                id: c.id,
                cls: c.className,
                innerHTMLLength: c.innerHTML.length,
            })),
            rootHTML: document.getElementById('root')?.innerHTML?.slice(0, 400) || '(no #root)',
            shellExists: !!document.querySelector('.tl-shell'),
            errors: window.__errors || null,
        };
    }""")
    print("DOM:", info)
    print("EVENTS:")
    for t, msg in events:
        print(f"  [{t}] {msg[:300]}")

    page.screenshot(path=".aws/screens-mobile/diag.png", full_page=False)
    ctx.close()
    browser.close()
