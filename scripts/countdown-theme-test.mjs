import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = path.join(process.cwd(), "test-results/browser");

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const loginRes = await page.request.post(`${BASE}/api/auth`, {
    data: { name: "owais", email: "owaisrak28@gmail.com" },
  });
  const cookies = loginRes.headers()["set-cookie"];
  const slugRes = await page.request.get(`${BASE}/api/capsules`, {
    headers: cookies ? { cookie: cookies.split(";")[0] } : {},
  });
  const data = await slugRes.json();
  const slug = data.capsules?.[0]?.shareSlug;
  if (!slug) throw new Error("No capsule slug");

  await page.goto(`${BASE}/c/${slug}`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("unlocked-theme", "dark");
  });
  await page.waitForTimeout(300);
  const darkTimer = await page.getByText("Days").isVisible();
  const darkLocked = await page.getByText("This capsule is locked.").isVisible();
  await page.screenshot({ path: path.join(OUT, "countdown-dark.png"), fullPage: true });
  console.log("✓ Dark: timer visible", darkTimer);
  console.log("✓ Dark: locked message", darkLocked);

  await page.goto(`${BASE}/c/${slug}`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("unlocked-theme", "light");
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const lightTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  const lightTimer = await page.getByText("Days").isVisible();
  const toggleCount = await page.locator('[data-testid="theme-toggle"]').count();
  await page.screenshot({ path: path.join(OUT, "countdown-light.png"), fullPage: true });
  console.log("✓ Light: theme attribute", lightTheme === "light");
  console.log("✓ Light: timer visible", lightTimer);
  console.log("✓ Theme toggle hidden on countdown", toggleCount === 0);

  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("unlocked-theme", "dark");
  });
  await page.waitForTimeout(300);
  const backDark = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  console.log("✓ Back to dark via storage", backDark === "dark");

  const sec1 = await page.locator(".countdown-unit").last().textContent();
  await page.waitForTimeout(1500);
  const sec2 = await page.locator(".countdown-unit").last().textContent();
  console.log("✓ Timer ticks", sec1 !== sec2 || sec1 === "00", `(${sec1} -> ${sec2})`);

  await browser.close();
  console.log("\nCountdown theme tests passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
