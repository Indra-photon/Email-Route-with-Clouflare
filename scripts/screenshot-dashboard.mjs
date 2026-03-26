import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, "../public/dashboard-screenshot.png");

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();

// 3× device pixel ratio, 1440px logical width → 4320px physical
await page.setViewport({
  width: 1440,
  height: 900,
  deviceScaleFactor: 3,
});

console.log("Navigating to dashboard…");
await page.goto("http://localhost:3000/dashboard", {
  waitUntil: "networkidle2",
  timeout: 30000,
});

// Wait for stat cards and right panel to load
await page.waitForSelector(".grid", { timeout: 10000 }).catch(() => {});

// Wait an extra moment for animations and charts to settle
await new Promise((r) => setTimeout(r, 2500));

// Hover over a chart element to surface a tooltip if one exists
try {
  const chartEl = await page.$("[class*='recharts'], [class*='chart'], canvas");
  if (chartEl) {
    const box = await chartEl.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.35);
      await new Promise((r) => setTimeout(r, 600));
    }
  }
} catch {}

await page.screenshot({ path: OUTPUT, fullPage: false });

await browser.close();
console.log(`Screenshot saved → ${OUTPUT}`);
