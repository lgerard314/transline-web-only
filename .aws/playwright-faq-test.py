"""Test FAQ open state - alignment of answer with question."""
from playwright.sync_api import sync_playwright
from pathlib import Path

OUT = Path(".aws/screens-mobile")

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844})
    page = ctx.new_page()
    page.goto("http://127.0.0.1:4937/", wait_until="domcontentloaded", timeout=20000)
    page.wait_for_selector(".tl-shell", timeout=10000)
    page.wait_for_timeout(800)

    # navigate to process page (has the biggest FAQ)
    page.locator(".tl-menu-btn").click()
    page.wait_for_timeout(300)
    page.locator(".tl-mobile-nav__list a", has_text="Cross-Border Process").first.click()
    page.wait_for_timeout(800)

    # scroll to FAQ section
    page.evaluate("document.getElementById('tl-process-faq')?.scrollIntoView({behavior:'instant'})")
    page.wait_for_timeout(400)

    # click first FAQ item to open it
    first_btn = page.locator(".tl-faq__btn").first
    if not first_btn.get_attribute("aria-expanded") == "true":
        first_btn.click()
        page.wait_for_timeout(500)

    page.screenshot(path=str(OUT / "faq-open-mobile.png"), full_page=False)

    # also desktop
    ctx2 = b.new_context(viewport={"width": 1280, "height": 800})
    page2 = ctx2.new_page()
    page2.goto("http://127.0.0.1:4937/", wait_until="domcontentloaded", timeout=20000)
    page2.wait_for_selector(".tl-shell", timeout=10000)
    page2.wait_for_timeout(800)
    page2.locator(".tl-nav-list a", has_text="Cross-Border Process").click()
    page2.wait_for_timeout(500)
    page2.evaluate("document.getElementById('tl-process-faq')?.scrollIntoView({behavior:'instant'})")
    page2.wait_for_timeout(400)
    page2.locator(".tl-faq__btn").first.click()
    page2.wait_for_timeout(500)
    page2.screenshot(path=str(OUT / "faq-open-desktop.png"), full_page=False)

    ctx.close(); ctx2.close(); b.close()
print("done")
