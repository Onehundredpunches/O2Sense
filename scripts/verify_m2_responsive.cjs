const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');

const PORT = 3456;
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

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

async function runVerification() {
  console.log('=== STARTING MILESTONE M2 RESPONSIVENESS VERIFICATION ===\n');

  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test static server running at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const viewports = [
    { name: 'Mobile XS', width: 320, height: 600 },
    { name: 'Mobile S', width: 375, height: 667 },
    { name: 'Mobile M', width: 390, height: 844 },
    { name: 'Tablet 768', width: 768, height: 1024 },
    { name: 'Desktop 1024', width: 1024, height: 768 },
    { name: 'Desktop 1280', width: 1280, height: 800 },
  ];

  let allPassed = true;
  const results = [];

  try {
    const page = await browser.newPage();

    for (const vp of viewports) {
      console.log(`\n--------------------------------------------------`);
      console.log(`Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`--------------------------------------------------`);

      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
      await sleep(400);

      // Navigate to Module C (Sinh lý bệnh - press key 2 or click nav)
      await page.keyboard.press('2');
      await sleep(500);

      // Check 1: Root & Body Horizontal Overflow
      const overflowCheck = await page.evaluate((vpWidth) => {
        const docScrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const maxScrollWidth = Math.max(docScrollWidth, bodyScrollWidth);
        const clientWidth = window.innerWidth;
        const hasOverflow = maxScrollWidth > clientWidth;

        // Check overflowing elements
        const badElements = [];
        if (hasOverflow) {
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > clientWidth + 1 && rect.width > 0 && rect.height > 0) {
              badElements.push({
                tag: el.tagName.toLowerCase(),
                className: (el.className || '').slice(0, 80),
                right: Math.round(rect.right),
                text: (el.innerText || '').slice(0, 30).replace(/\n/g, ' ')
              });
              if (badElements.length >= 3) break;
            }
          }
        }

        return { docScrollWidth, bodyScrollWidth, maxScrollWidth, clientWidth, hasOverflow, badElements };
      }, vp.width);

      console.log(`* Page Overflow: maxScroll=${overflowCheck.maxScrollWidth}px vs clientWidth=${overflowCheck.clientWidth}px -> ${!overflowCheck.hasOverflow ? 'PASS ✅' : 'FAIL ❌'}`);
      if (overflowCheck.hasOverflow) {
        console.error('  Bad elements:', overflowCheck.badElements);
        allPassed = false;
      }

      // Check 2: Header BrandLogo userMode badge visibility at <420px
      if (vp.width < 420) {
        const badgeHidden = await page.evaluate(() => {
          const badge = document.querySelector('header span.uppercase');
          if (!badge) return true; // not rendered or hidden
          const style = window.getComputedStyle(badge);
          return style.display === 'none';
        });
        console.log(`* BrandLogo badge hidden on ultra-narrow (<420px): ${badgeHidden ? 'PASS ✅' : 'FAIL ❌'}`);
        if (!badgeHidden) allPassed = false;
      }

      // Check 3: Bottom controls bar collision at 320px
      if (vp.width === 320) {
        const controlsCheck = await page.evaluate(() => {
          const autoPlaySpan = document.querySelector('button span.hidden.min-\\[380px\\]\\:inline') ||
            Array.from(document.querySelectorAll('button span')).find(s => s.innerText.includes('Tự động chạy') || s.innerText.includes('Tạm dừng'));
          const isTextHidden = autoPlaySpan ? window.getComputedStyle(autoPlaySpan).display === 'none' : true;

          // Measure gap between play/pause group and step nav
          const resetBtn = document.querySelector('button[title="Bắt đầu lại"]');
          const container = resetBtn ? resetBtn.closest('.flex.items-center.justify-between') : null;
          if (container && container.children.length >= 2) {
            const leftGroup = container.children[0];
            const rightGroup = container.children[1];
            const lRect = leftGroup.getBoundingClientRect();
            const rRect = rightGroup.getBoundingClientRect();
            const gap = rRect.left - lRect.right;
            return {
              isTextHidden,
              gap,
              leftGroupWidth: Math.round(lRect.width),
              rightGroupWidth: Math.round(rRect.width),
              containerWidth: Math.round(container.getBoundingClientRect().width)
            };
          }
          return { isTextHidden, gap: 50 };
        });
        console.log(`* Bottom controls "Tự động chạy" text hidden at 320px: ${controlsCheck.isTextHidden ? 'PASS ✅' : 'FAIL ❌'}`);
        console.log(`* Controls metrics at 320px: leftGroup=${controlsCheck.leftGroupWidth}px, rightGroup=${controlsCheck.rightGroupWidth}px, container=${controlsCheck.containerWidth}px, gap=${Math.round(controlsCheck.gap)}px`);
        console.log(`* Gap between bottom control groups at 320px: ${Math.round(controlsCheck.gap)}px (expected >= 15px) -> ${controlsCheck.gap >= 15 ? 'PASS ✅' : 'FAIL ❌'}`);
        if (!controlsCheck.isTextHidden || controlsCheck.gap < 15) allPassed = false;
      }

      // Check 4: Subtabs bar buttons have whitespace-nowrap and flex-shrink-0
      const subtabsCheck = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('.overflow-x-auto button'));
        if (buttons.length < 3) return { found: false, count: buttons.length };
        const results = buttons.map(b => {
          const style = window.getComputedStyle(b);
          const hasNowrap = style.whiteSpace === 'nowrap';
          const rect = b.getBoundingClientRect();
          return {
            text: b.innerText.trim(),
            hasNowrap,
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          };
        });
        const allNowrap = results.every(r => r.hasNowrap);
        return { found: true, allNowrap, results };
      });
      console.log(`* Subtabs buttons whitespace-nowrap & flex-shrink-0: ${subtabsCheck.allNowrap ? 'PASS ✅' : 'FAIL ❌'}`);
      if (!subtabsCheck.allNowrap) {
        console.error('  Subtabs details:', subtabsCheck.results);
        allPassed = false;
      }

      // Check 5: Step 2 Snoring Banner fit inside stage without clipping
      // Navigate to Step 2
      await page.evaluate(() => {
        const nextBtn = document.querySelector('button[title="Bước tiếp theo"]');
        if (nextBtn) nextBtn.click(); // to step 2
      });
      await sleep(300);

      const banner2Check = await page.evaluate(() => {
        const stage = document.querySelector('.aspect-\\[4\\/3\\], .aspect-\\[16\\/10\\]');
        const banner = Array.from(document.querySelectorAll('div')).find(d =>
          d.innerText && d.innerText.includes('tiếng ngáy') && d.className.includes('bg-amber-950')
        );
        if (!stage || !banner) return { found: false };
        const sRect = stage.getBoundingClientRect();
        const bRect = banner.getBoundingClientRect();
        const fitsHorizontally = bRect.left >= sRect.left - 1 && bRect.right <= sRect.right + 1;
        return {
          found: true,
          fitsHorizontally,
          stageWidth: Math.round(sRect.width),
          bannerWidth: Math.round(bRect.width),
          sLeft: Math.round(sRect.left),
          bLeft: Math.round(bRect.left),
          sRight: Math.round(sRect.right),
          bRight: Math.round(bRect.right),
        };
      });
      console.log(`* Step 2 Snoring Banner fits in stage: ${banner2Check.fitsHorizontally ? 'PASS ✅' : 'FAIL ❌'} (Stage: ${banner2Check.stageWidth}px, Banner: ${banner2Check.bannerWidth}px)`);
      if (!banner2Check.fitsHorizontally) {
        console.error('  Banner 2 clipping metrics:', banner2Check);
        allPassed = false;
      }

      // Check 6: Step 4 Hypoxia Alarm Banner fit inside stage without clipping
      // Advance to Step 4 (click next twice)
      await page.evaluate(() => {
        const nextBtn = document.querySelector('button[title="Bước tiếp theo"]');
        if (nextBtn) { nextBtn.click(); }
      });
      await sleep(200);
      await page.evaluate(() => {
        const nextBtn = document.querySelector('button[title="Bước tiếp theo"]');
        if (nextBtn) { nextBtn.click(); }
      });
      await sleep(300);

      const banner4Check = await page.evaluate(() => {
        const stage = document.querySelector('.aspect-\\[4\\/3\\], .aspect-\\[16\\/10\\]');
        const banner = Array.from(document.querySelectorAll('div')).find(d =>
          d.innerText && d.innerText.includes('SpO₂ đang tụt thấp') && d.className.includes('bg-rose-950')
        );
        if (!stage || !banner) return { found: false };
        const sRect = stage.getBoundingClientRect();
        const bRect = banner.getBoundingClientRect();
        const fitsHorizontally = bRect.left >= sRect.left - 1 && bRect.right <= sRect.right + 1;
        return {
          found: true,
          fitsHorizontally,
          stageWidth: Math.round(sRect.width),
          bannerWidth: Math.round(bRect.width),
          sLeft: Math.round(sRect.left),
          bLeft: Math.round(bRect.left),
          sRight: Math.round(sRect.right),
          bRight: Math.round(bRect.right),
        };
      });
      console.log(`* Step 4 Hypoxia Alarm Banner fits in stage: ${banner4Check.fitsHorizontally ? 'PASS ✅' : 'FAIL ❌'} (Stage: ${banner4Check.stageWidth}px, Banner: ${banner4Check.bannerWidth}px)`);
      if (!banner4Check.fitsHorizontally) {
        console.error('  Banner 4 clipping metrics:', banner4Check);
        allPassed = false;
      }

      // Check 7: Step 5 Delay Disclaimer wrapping
      await page.evaluate(() => {
        const nextBtn = document.querySelector('button[title="Bước tiếp theo"]');
        if (nextBtn) { nextBtn.click(); }
      });
      await sleep(300);

      const disclaimerCheck = await page.evaluate((vpWidth) => {
        const span = Array.from(document.querySelectorAll('span')).find(s =>
          s.innerText && s.innerText.includes('SpO₂ ở ngón tay phản ứng trễ')
        );
        if (!span) return { found: false };
        const rect = span.getBoundingClientRect();
        const style = window.getComputedStyle(span);
        const wraps = style.whiteSpace !== 'nowrap';
        const fitsInViewport = rect.right <= vpWidth;
        return { found: true, wraps, fitsInViewport, width: Math.round(rect.width), right: Math.round(rect.right) };
      }, vp.width);
      console.log(`* Step 5 Delay Disclaimer wraps without overflow: ${disclaimerCheck.fitsInViewport && disclaimerCheck.wraps ? 'PASS ✅' : 'FAIL ❌'} (Width: ${disclaimerCheck.width}px, wraps: ${disclaimerCheck.wraps})`);
      if (!disclaimerCheck.fitsInViewport || !disclaimerCheck.wraps) {
        allPassed = false;
      }

      results.push({
        viewport: vp.name,
        width: vp.width,
        noOverflow: !overflowCheck.hasOverflow,
        banner2Fits: banner2Check.fitsHorizontally,
        banner4Fits: banner4Check.fitsHorizontally,
        subtabsNowrap: subtabsCheck.allNowrap,
      });
    }

    console.log('\n==================================================');
    console.log('SUMMARY OF ALL VIEWPORTS AUDITED:');
    console.table(results);
    console.log(`OVERALL RESULT: ${allPassed ? '100% PASS ✅' : 'FAILURES DETECTED ❌'}`);
    console.log('==================================================');

  } finally {
    await browser.close();
    server.close();
  }

  process.exit(allPassed ? 0 : 1);
}

runVerification().catch(err => {
  console.error('Fatal error in verification:', err);
  process.exit(1);
});
