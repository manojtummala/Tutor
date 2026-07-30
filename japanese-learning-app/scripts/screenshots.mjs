import { chromium } from "@playwright/test";

const base = "http://localhost:3000";
const routes = [
  "/dashboard",
  "/learn",
  "/learn/kana",
  "/learn/kana/hiragana",
  "/learn/kana/katakana",
  "/learn/kana/variations",
  "/learn/n5",
  "/practice",
  "/review",
  "/library",
  "/library/kana",
  "/library/vocabulary",
  "/library/kanji",
  "/library/grammar",
  "/progress",
  "/settings",
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

for (const route of routes) {
  const url = `${base}${route}`;
  const filename = route.replace(/\//g, "_").slice(1) || "index";
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `screenshots/${filename}.png`, fullPage: true });
    console.log(`✓ ${url}`);
  } catch (err) {
    console.error(`✗ ${url}: ${err.message}`);
  }
}

await browser.close();
console.log("Done.");
