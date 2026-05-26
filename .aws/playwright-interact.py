"""End-to-end interaction test against the live site."""
from playwright.sync_api import sync_playwright

URL = "http://transline-web-only-248358863034.s3-website-us-east-1.amazonaws.com/"

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": 390, "height": 844})
    page = ctx.new_page()
    events = []
    page.on("console", lambda m: events.append((m.type, m.text)))
    page.on("pageerror", lambda e: events.append(("pageerror", str(e))))

    page.goto(URL, wait_until="domcontentloaded", timeout=30000)
    page.wait_for_selector(".tl-shell", timeout=15000)
    page.wait_for_timeout(1200)

    print(f"1. Home loaded: title='{page.title()}' shell={page.locator('.tl-shell').count()}")

    # 2. Open hamburger
    page.locator(".tl-menu-btn").click()
    page.wait_for_timeout(400)
    open_state = page.locator(".tl-mobile-nav[data-open='1']").count()
    print(f"2. Menu opens: {open_state == 1}")

    # 3. Click About
    page.locator(".tl-mobile-nav__list a", has_text="About").first.click()
    page.wait_for_timeout(800)
    about_h1 = page.locator("h1.tl-hero__title").first.inner_text()
    print(f"3. Navigate to About: heading starts with '{about_h1[:50]}'")

    # 4. Hamburger again, navigate to Contact
    page.locator(".tl-menu-btn").click()
    page.wait_for_timeout(400)
    page.locator(".tl-mobile-nav__list a", has_text="Contact").first.click()
    page.wait_for_timeout(800)
    contact_h1 = page.locator("h1.tl-hero__title").first.inner_text()
    print(f"4. Navigate to Contact: heading starts with '{contact_h1[:50]}'")

    # 5. Fill form and click continue
    page.locator(".tl-mobile-nav__foot a, .tl-form-progress, [class*='form-shell']").first.wait_for(timeout=5000)
    page.locator(".tl-field input").nth(0).fill("Test User")
    page.locator(".tl-field input").nth(1).fill("Test Co")
    page.locator(".tl-field input").nth(2).fill("test@example.com")
    page.locator(".tl-form-body .tl-btn--dark, .tl-form-body .tl-btn--primary").first.click()
    page.wait_for_timeout(500)
    on_step2 = page.locator(".tl-form-progress__step[data-active='1']").get_attribute("class")
    step2_text = page.locator(".tl-form-progress__step[data-active='1'] .num").first.inner_text()
    print(f"5. Form advances to step 2: num='{step2_text}'")

    # 6. Go back to home via mobile nav
    page.locator(".tl-menu-btn").click()
    page.wait_for_timeout(400)
    page.locator(".tl-mobile-nav__list a", has_text="Home").first.click()
    page.wait_for_timeout(800)
    home_h1 = page.locator("h1.tl-hero__title").first.inner_text()
    print(f"6. Navigate back to Home: heading starts with '{home_h1[:50]}'")

    print(f"\nConsole errors: {sum(1 for t,_ in events if t in ('error','pageerror'))}")
    if any(t in ('error','pageerror') for t,_ in events):
        for t, m in events:
            if t in ('error','pageerror'):
                print(f"  [{t}] {m[:300]}")

    ctx.close()
    browser.close()
