const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'app_screenshots_corrective_pass');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== CAPTURING TARGETED CORRECTIVE EVIDENCE (11 ITEMS) ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1366, height: 960 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1366,960'],
  });

  const page = await browser.newPage();
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await sleep(1000);

  // 1. Evidence for I-02: CMC-09 badge in Waveform Detective
  await page.keyboard.press('3');
  await sleep(800);
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="cmc09-badge"]') ||
               Array.from(document.querySelectorAll('span, div')).find(e => e.textContent.includes('Quy tắc nội bộ O2Sense CMC-09'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await sleep(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidence_I02_cmc09_internal_branding.png') });
  console.log('[EVIDENCE] Saved evidence_I02_cmc09_internal_branding.png');

  // 2. Evidence for I-11: Step 2 Pevernagie citation & snoring mechanism
  await page.keyboard.press('2');
  await sleep(800);
  await page.evaluate(() => {
    localStorage.setItem('o2sense_mode', 'founder');
    const stepButtons = Array.from(document.querySelectorAll('.grid.grid-cols-2.sm\\:grid-cols-5 button'));
    if (stepButtons[1]) stepButtons[1].click();
  });
  await sleep(600);
  await page.evaluate(() => {
    const citeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Xem trích dẫn'));
    if (citeBtn) citeBtn.click();
  });
  await sleep(600);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidence_I11_step2_pevernagie_citation.png') });
  console.log('[EVIDENCE] Saved evidence_I11_step2_pevernagie_citation.png');
  await page.keyboard.press('Escape');
  await sleep(400);

  // 3. Evidence for Help Center Chapters (I-01, I-03, I-04, I-05, I-06, I-07, I-08, I-09, I-10)
  await page.keyboard.press('6');
  await sleep(1000);

  // Chapter 2 (I-07)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.lg\\:col-span-4 button.w-full'));
    if (btns[1]) btns[1].click(); // Chapter 2: 1 Đêm Thở Nghẽn (3D)
  });
  await sleep(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidence_I07_chapter2_physiology_alignment.png') });
  console.log('[EVIDENCE] Saved evidence_I07_chapter2_physiology_alignment.png');

  // Chapter 3 (I-08)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.lg\\:col-span-4 button.w-full'));
    if (btns[2]) btns[2].click(); // Chapter 3: Giải Mã SpO2 Đêm
  });
  await sleep(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidence_I08_chapter3_waveform_qualifier.png') });
  console.log('[EVIDENCE] Saved evidence_I08_chapter3_waveform_qualifier.png');

  // Chapter 4 (I-03, I-04, I-09)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.lg\\:col-span-4 button.w-full'));
    if (btns[3]) btns[3].click(); // Chapter 4: Kho Kiến Thức Y Khoa
  });
  await sleep(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidence_I03_I04_I09_chapter4_cpap_risk_chain.png') });
  console.log('[EVIDENCE] Saved evidence_I03_I04_I09_chapter4_cpap_risk_chain.png');

  // Chapter 5 (I-01, I-06, I-10)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.lg\\:col-span-4 button.w-full'));
    if (btns[4]) btns[4].click(); // Chapter 5: 6 Tình Huống Thực Tế
  });
  await sleep(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidence_I01_I06_I10_chapter5_scenarios_bp.png') });
  console.log('[EVIDENCE] Saved evidence_I01_I06_I10_chapter5_scenarios_bp.png');

  // Chapter 6 (I-05)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.lg\\:col-span-4 button.w-full'));
    if (btns[5]) btns[5].click(); // Chapter 6: Phím Tắt & Từ Điển
  });
  await sleep(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidence_I05_chapter6_calm_communication.png') });
  console.log('[EVIDENCE] Saved evidence_I05_chapter6_calm_communication.png');

  await browser.close();
  console.log('=== ALL TARGETED EVIDENCE CAPTURED SUCCESSFULLY ===');
}

main().catch(err => {
  console.error('Evidence capture failed:', err);
  process.exit(1);
});
