const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');

const PORT = 3355;
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'app_screenshots_v131', 'responsive_audit');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function createStaticServer() {
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    let filePath = path.join(DIST_DIR, reqPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (err) {
      res.writeHead(500);
      res.end('Server Error: ' + err.message);
    }
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function checkHorizontalOverflow(page, contextStr) {
  const result = await page.evaluate(() => {
    const scrollWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth
    );
    const clientWidth = window.innerWidth;
    const hasHorizontalOverflow = scrollWidth > clientWidth + 2; // allowance for 2px subpixel

    let overflowingElements = [];
    if (hasHorizontalOverflow) {
      const allElements = document.querySelectorAll('*');
      for (const el of allElements) {
        const rect = el.getBoundingClientRect();
        // check if element extends past viewport
        if (rect.right > clientWidth + 2 && rect.width > 0 && rect.height > 0) {
          const classStr = el.getAttribute('class') || '';
          const tag = el.tagName.toLowerCase();
          const text = (el.innerText || '').slice(0, 40).replace(/\n/g, ' ');
          overflowingElements.push({
            tag,
            class: classStr.slice(0, 60),
            text,
            right: Math.round(rect.right),
            clientWidth,
          });
          if (overflowingElements.length >= 5) break;
        }
      }
    }

    return {
      scrollWidth,
      clientWidth,
      hasHorizontalOverflow,
      overflowingElements,
    };
  });

  if (result.hasHorizontalOverflow) {
    console.warn(`⚠️ [OVERFLOW DETECTED] ${contextStr}: scrollWidth=${result.scrollWidth}px > clientWidth=${result.clientWidth}px`);
    console.warn('Elements causing overflow:', JSON.stringify(result.overflowingElements, null, 2));
  } else {
    console.log(`✅ [PASS NO OVERFLOW] ${contextStr} (w: ${result.clientWidth}px, scroll: ${result.scrollWidth}px)`);
  }
  return result;
}

async function runAudit() {
  console.log('--- Starting Responsive & Layout Audit ---');
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Static server listening on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const viewports = [
    { name: 'desktop_1366', width: 1366, height: 768 },
    { name: 'tablet_768', width: 768, height: 1024 },
    { name: 'mobile_375', width: 375, height: 667 },
  ];

  let totalErrors = 0;
  const auditReport = [];

  try {
    const page = await browser.newPage();

    for (const vp of viewports) {
      console.log(`\n========================================`);
      console.log(`AUDITING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`========================================`);

      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
      await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
      await sleep(600);

      // Tab 1: Home (Key 1)
      await page.keyboard.press('1');
      await sleep(600);
      let res = await checkHorizontalOverflow(page, `${vp.name} - Home View`);
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}_home.png`) });
      if (res.hasHorizontalOverflow) totalErrors++;
      auditReport.push({ viewport: vp.name, view: 'Home', pass: !res.hasHorizontalOverflow, ...res });

      // Tab 2: Module C (Sinh lý bệnh - Key 2)
      await page.keyboard.press('2');
      await sleep(600);
      res = await checkHorizontalOverflow(page, `${vp.name} - Module C (Sinh lý bệnh)`);
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}_module_c.png`) });
      if (res.hasHorizontalOverflow) totalErrors++;
      auditReport.push({ viewport: vp.name, view: 'Module C', pass: !res.hasHorizontalOverflow, ...res });

      // Tab 3: Waveform Detective (Key 3)
      await page.keyboard.press('3');
      await sleep(600);
      res = await checkHorizontalOverflow(page, `${vp.name} - Waveform Detective`);
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}_waveform.png`) });
      if (res.hasHorizontalOverflow) totalErrors++;
      auditReport.push({ viewport: vp.name, view: 'Waveform Detective', pass: !res.hasHorizontalOverflow, ...res });

      // Tab 4: Knowledge Hub (Key 4)
      await page.keyboard.press('4');
      await sleep(600);
      res = await checkHorizontalOverflow(page, `${vp.name} - Knowledge Hub`);
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}_knowledge_hub.png`) });
      if (res.hasHorizontalOverflow) totalErrors++;
      auditReport.push({ viewport: vp.name, view: 'Knowledge Hub', pass: !res.hasHorizontalOverflow, ...res });

      // Tab 5: Cases & Traps (Key 5) - Module A (Traps)
      await page.keyboard.press('5');
      await sleep(600);
      res = await checkHorizontalOverflow(page, `${vp.name} - Module A (Hiểu lầm & Ca bẫy)`);
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}_module_a.png`) });
      if (res.hasHorizontalOverflow) totalErrors++;
      auditReport.push({ viewport: vp.name, view: 'Module A', pass: !res.hasHorizontalOverflow, ...res });

      // Verify GIỚI TÍNH badge specifically in Module A
      const genderBadgePresent = await page.evaluate(() => {
        const badges = Array.from(document.querySelectorAll('span, button')).map((b) => b.innerText.trim());
        return badges.some((text) => text === 'GIỚI TÍNH');
      });
      console.log(`   * GIỚI TÍNH badge rendered in Module A: ${genderBadgePresent}`);
      if (!genderBadgePresent) {
        console.error('❌ GIỚI TÍNH badge not found in Module A!');
        totalErrors++;
      }

      // Check Scenarios subtab in Cases (Module B)
      const clickedScenarios = await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find((b) =>
          b.textContent.includes('Tình Huống') || b.textContent.includes('Nhập Vai')
        );
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });
      if (clickedScenarios) {
        await sleep(500);
        res = await checkHorizontalOverflow(page, `${vp.name} - Module B (Tình huống thực hành)`);
        await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}_module_b.png`) });
        if (res.hasHorizontalOverflow) totalErrors++;
        auditReport.push({ viewport: vp.name, view: 'Module B', pass: !res.hasHorizontalOverflow, ...res });
      }

      // Tab 6: Help Center (Key 6)
      await page.keyboard.press('6');
      await sleep(600);
      res = await checkHorizontalOverflow(page, `${vp.name} - Help Center`);
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}_help_center.png`) });
      if (res.hasHorizontalOverflow) totalErrors++;
      auditReport.push({ viewport: vp.name, view: 'Help Center', pass: !res.hasHorizontalOverflow, ...res });

      // Test Quick Review Modal in this viewport
      const qrBtn = await page.$('[data-testid="quick-review-header-btn"]');
      if (qrBtn) {
        await qrBtn.click();
        await sleep(500);
        res = await checkHorizontalOverflow(page, `${vp.name} - Quick Review Modal`);
        await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}_quick_review_modal.png`) });
        if (res.hasHorizontalOverflow) totalErrors++;
        auditReport.push({ viewport: vp.name, view: 'Quick Review Modal', pass: !res.hasHorizontalOverflow, ...res });
        const closeBtn = await page.$('[data-testid="quick-review-close-btn"]');
        if (closeBtn) await closeBtn.click();
        await sleep(400);
      }

      // Test Mode Switch (toggle between Chuyên sâu and Phổ thông)
      const modeBtn = await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find((b) =>
          b.textContent.includes('Chuyên sâu') || b.textContent.includes('Phổ thông')
        );
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });
      if (modeBtn) {
        await sleep(400);
        res = await checkHorizontalOverflow(page, `${vp.name} - Switched Mode`);
        if (res.hasHorizontalOverflow) totalErrors++;
        // Switch back
        await page.evaluate(() => {
          const btn = Array.from(document.querySelectorAll('button')).find((b) =>
            b.textContent.includes('Chuyên sâu') || b.textContent.includes('Phổ thông')
          );
          if (btn) btn.click();
        });
        await sleep(300);
      }
    }

    fs.writeFileSync(
      path.resolve(__dirname, '..', 'responsive_audit_results.json'),
      JSON.stringify(auditReport, null, 2),
      'utf8'
    );
    console.log('\n--- Responsive Audit Completed ---');
    console.log(`Total Overflow/Layout Violations: ${totalErrors}`);
    if (totalErrors > 0) {
      console.error(`❌ AUDIT FAILED with ${totalErrors} violations.`);
      process.exit(1);
    } else {
      console.log('✅ ALL VIEWPORTS (Desktop 1366, Tablet 768, Mobile 375) PASSED ZERO-OVERFLOW AUDIT!');
    }
  } finally {
    await browser.close();
    server.close();
  }
}

runAudit().catch((err) => {
  console.error('Audit fatal error:', err);
  process.exit(1);
});
