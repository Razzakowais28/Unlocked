import { chromium } from "playwright";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = path.join(process.cwd(), "test-results/browser");
const results = [];

function log(name, pass, detail = "") {
  results.push({ name, pass, detail });
  const icon = pass ? "✓" : "✗";
  console.log(`${icon} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    // 1. Landing page
    await page.goto(BASE, { waitUntil: "networkidle" });
    const hero = await page.getByRole("heading", { name: /message meant for the/i }).isVisible();
    log("Landing: hero heading", hero);
    const futureGradient = await page.locator(".gradient-text", { hasText: "future" }).isVisible();
    log("Landing: gradient 'future' text", futureGradient);
    const createCta = await page.getByRole("link", { name: /create your capsule/i }).first().isVisible();
    log("Landing: Create your capsule CTA", createCta);
    await page.locator("#how-it-works").scrollIntoViewIfNeeded();
    const howItWorks = await page.getByRole("heading", { name: "How it works" }).isVisible();
    log("Landing: How it works section", howItWorks);
    await page.locator("#features").scrollIntoViewIfNeeded();
    const features = await page.getByRole("heading", { name: "Everything you need" }).isVisible();
    log("Landing: Features section", features);
    await screenshot(page, "01-landing");

    // 2. Pricing page
    await page.goto(`${BASE}/pricing`, { waitUntil: "networkidle" });
    const pricingHeading = await page.getByRole("heading", { name: /choose your/i }).isVisible();
    log("Pricing: page loads", pricingHeading);
    const freePlan = await page.getByText("Free", { exact: true }).first().isVisible();
    log("Pricing: Free plan visible", freePlan);
    const premiumBtn = page.getByRole("button", { name: "Go Premium" });
    if (await premiumBtn.isVisible()) {
      await premiumBtn.click();
      const toast = await page.getByText("Payments coming soon!").isVisible({ timeout: 3000 });
      log("Pricing: Premium shows coming soon toast", toast);
    } else {
      log("Pricing: Premium button", false, "button not found");
    }
    await screenshot(page, "02-pricing");

    // 3. Login flow
    await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
    const loginHeading = await page.getByRole("heading", { name: "Welcome back" }).isVisible();
    log("Login: page loads", loginHeading);
    await page.fill('input[placeholder="Your name"]', "owais");
    await page.fill('input[placeholder="you@example.com"]', "owaisrak28@gmail.com");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    const onDashboard = page.url().includes("/dashboard");
    log("Login: redirects to dashboard", onDashboard);
    await screenshot(page, "03-dashboard");

    // 4. Dashboard content
    const greeting = await page.getByText(/Good (morning|afternoon|evening), Alex/i).isVisible();
    log("Dashboard: greeting with Alex", greeting);
    const stats = await page.getByText("Total capsules").isVisible();
    log("Dashboard: stats cards", stats);
    const upcoming = await page.getByRole("heading", { name: "Upcoming unlocks" }).isVisible();
    log("Dashboard: upcoming unlocks section", upcoming);
    const capsuleCard = await page.getByText("Birthday Message").isVisible();
    log("Dashboard: seeded capsule visible", capsuleCard);
    const newCapsule = page.getByRole("link", { name: /new capsule/i }).first();
    log("Dashboard: New Capsule button", await newCapsule.isVisible());

    // 5. Public countdown page
    const slugRes = await page.request.get(`${BASE}/api/capsules`);
    const slugData = await slugRes.json();
    const slug = slugData.capsules?.[0]?.shareSlug;
    if (slug) {
      await page.goto(`${BASE}/c/${slug}`, { waitUntil: "networkidle" });
      const locked = await page.getByText("This capsule is locked.").isVisible();
      log("Countdown: locked state message", locked);
      const countdown = await page.getByText("Days").isVisible();
      log("Countdown: timer visible", countdown);
      const title = await page.getByRole("heading", { level: 1 }).isVisible();
      log("Countdown: capsule title shown", title);
      // Content must NOT leak before unlock
      const leaked = await page.getByText("Dear future you").isVisible().catch(() => false);
      log("Countdown: block content hidden", !leaked, leaked ? "content leaked!" : "ok");
      await screenshot(page, "04-countdown");

      // 6. Open page should redirect if not unlocked
      await page.goto(`${BASE}/c/${slug}/open`, { waitUntil: "networkidle" });
      const redirected = page.url().includes(`/c/${slug}`) && !page.url().endsWith("/open");
      log("Open: redirects to countdown when locked", redirected, page.url());
    } else {
      log("Countdown: get slug from API", false, "no capsules");
    }

    // 7. Create capsule flow (steps 1-3)
    await page.goto(`${BASE}/capsules/new`, { waitUntil: "networkidle" });
    const step1 = await page.getByRole("heading", { name: "Choose capsule type" }).isVisible();
    log("Create: step 1 loads", step1);
    await page.getByRole("button", { name: "Personal" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForSelector('input[placeholder="My 2030 Goals"]');
    log("Create: step 2 reached", true);
    await page.fill('input[placeholder="My 2030 Goals"]', "Browser Test Capsule");
    await page.fill('textarea[placeholder="A message for my future self..."]', "Testing from Playwright");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForSelector("text=Choose unlock date");
    log("Create: step 3 reached", true);
    await page.getByRole("button", { name: "1 year" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForSelector("text=Add memories");
    log("Create: step 4 reached", true);
    await page.getByRole("button", { name: "Text" }).click();
    await page.fill('input[placeholder="Block title"]', "Test Letter");
    await page.fill('textarea[placeholder="Write your letter..."]', "Hello future me!");
    await screenshot(page, "05-create-capsule");
    await page.getByRole("button", { name: "Create Capsule" }).click();
    await page.waitForURL("**/preview", { timeout: 15000 });
    log("Create: capsule created, preview page", page.url().includes("/preview"));
    await screenshot(page, "06-preview");

    // 8. Lock capsule
    const lockBtn = page.getByRole("button", { name: /lock capsule/i });
    if (await lockBtn.isVisible()) {
      await lockBtn.click();
      await page.waitForURL("**/c/**", { timeout: 10000 });
      log("Preview: lock redirects to countdown", page.url().includes("/c/"));
      await screenshot(page, "07-locked-countdown");
    }

    // 9. Mobile viewport smoke test
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE, { waitUntil: "networkidle" });
    const mobileHero = await page.getByRole("heading", { name: /message meant for the/i }).isVisible();
    log("Mobile: landing renders", mobileHero);
    await screenshot(page, "08-mobile-landing");
    await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
    const mobileDash = await page.getByText(/Good (morning|afternoon|evening)/i).isVisible();
    log("Mobile: dashboard renders", mobileDash);
    await screenshot(page, "09-mobile-dashboard");

  } catch (err) {
    console.error("Test run error:", err.message);
    await screenshot(page, "error-state").catch(() => {});
    log("Test run", false, err.message);
  } finally {
    await browser.close();
  }

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass);
  const summary = { passed, failed: failed.length, total: results.length, failures: failed, results };
  await writeFile(path.join(OUT, "report.json"), JSON.stringify(summary, null, 2));

  console.log("\n---");
  console.log(`Results: ${passed}/${results.length} passed`);
  if (failed.length) {
    console.log("Failures:");
    failed.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`));
    process.exit(1);
  }
}

main();
