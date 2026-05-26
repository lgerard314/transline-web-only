"""Capture viewport-sized screenshots while scrolling through each mobile page.
Lets me see actual mobile rendering section by section instead of a single
shrunken full-page image."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4937/"
OUT = Path(".aws/screens-mobile")
OUT.mkdir(parents=True, exist_ok=True)
# Clear previous
for f in OUT.glob("*.png"):
    f.unlink()

PAGES = [
    ("home",     "Home"),
    ("services", "Services"),
    ("process",  "Cross-Border Process"),
    ("about",    "About"),
    ("contact",  "Contact"),
]

VW, VH = 390, 844

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=2)
    page = ctx.new_page()
    page.goto(BASE, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_selector(".tl-shell", timeout=15000)
    page.wait_for_timeout(900)

    for page_id, label in PAGES:
        if page_id != "home":
            # mobile menu route
            page.locator(".tl-menu-btn").click()
            page.wait_for_timeout(220)
            page.locator(".tl-mobile-nav__list a", has_text=label).first.click()
            page.wait_for_timeout(700)
        # Force reveals visible
        page.evaluate("""() => {
            document.querySelectorAll('[data-reveal], [data-reveal-stagger]')
              .forEach(el => el.setAttribute('data-in', '1'));
        }""")
        # Get full document height
        doc_h = page.evaluate("() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)")
        # Scroll in 760-px steps (overlap a little) and snapshot
        step = VH - 80  # 80px overlap
        y = 0
        i = 0
        while y < doc_h:
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(200)
            page.screenshot(path=str(OUT / f"{page_id}-{i:02d}-y{y}.png"), full_page=False)
            y += step
            i += 1
        # Final scroll back to top so next nav click is reliable
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(150)

    ctx.close()
    browser.close()
print("done")
