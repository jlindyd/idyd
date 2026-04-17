import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

const outDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let n = 1;
while (fs.existsSync(path.join(outDir, `screenshot-${n}${label}.png`))) n++;
const outPath = path.join(outDir, `screenshot-${n}${label}.png`);

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: undefined,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: outPath, fullPage: false });
await browser.close();
console.log(`Screenshot saved: ${outPath}`);
