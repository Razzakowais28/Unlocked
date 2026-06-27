import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = path.join(process.cwd(), "test-results/browser");

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(OUT, name), fullPage: true });
}

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("unlocked-theme", t);
  }, theme);
  await page.reload({ waitUntil: "networkidle" });
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(BASE);
  await setTheme(page, "dark");
  await page.waitForSelector('[data-testid="theme-toggle"]');
  await screenshot(page, "app-landing-dark.png");
  console.log("✓ Landing dark");

  await page.getByTestId("theme-toggle").click();
  await page.waitForFunction(() => document.documentElement.getAttribute("data-theme") === "light");
  await screenshot(page, "app-landing-light.png");
  console.log("✓ Landing light");

  await page.goto(`${BASE}/login`);
  await screenshot(page, "app-login-light.png");
  const loginTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  console.log("✓ Login inherits light theme", loginTheme === "light");

  await page.fill('input[placeholder="Your name"]', "owais");
  await page.fill('input[placeholder="you@example.com"]', "owaisrak28@gmail.com");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForURL("**/dashboard");
  const dashboardTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  await screenshot(page, "app-dashboard-light.png");
  console.log("✓ Dashboard inherits light theme", dashboardTheme === "light");

  const toggleOnDashboard = await page.locator('[data-testid="theme-toggle"]').count();
  console.log("✓ Theme toggle hidden on dashboard", toggleOnDashboard === 0);

  await browser.close();
  console.log("\nApp-wide theme tests passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
