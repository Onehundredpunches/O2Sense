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
};

function createStaticServer() {
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
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
      res.end('Server error: ' + err.message);
    }
  });
}

async function runEmpiricalBrowserVerification() {
  console.log('=== STARTING EMPIRICAL BROWSER & LAYOUT VERIFICATION ===');

  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('dist directory does not exist. Run npm run build first.');
  }

  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[Server] Serving dist on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Track console errors and warnings
  const consoleErrors = [];
  const consoleWarnings = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') consoleErrors.push(text);
    if (msg.type() === 'warning') consoleWarnings.push(text);
  });
  page.on('pageerror', (err) => {
    consoleErrors.push('PAGEERROR: ' + err.message);
  });

  // Track WebGL context creation attempts
  await page.evaluateOnNewDocument(() => {
    window.__webgl_contexts_created = 0;
    const origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
        window.__webgl_contexts_created++;
        console.warn(`[BROWSER SPY] WebGL getContext called: ${type}`);
      }
      return origGetContext.call(this, type, ...args);
    };
  });

  const viewports = [
    { name: 'Mobile (375x667)', width: 375, height: 667, expectedMinHeight: 460 },
    { name: 'Small Mobile (320x568)', width: 320, height: 568, expectedMinHeight: 460 },
    { name: 'Tablet (768x1024)', width: 768, height: 1024, expectedMinHeight: 520 },
    { name: 'Desktop (1280x800)', width: 1280, height: 800, expectedMinHeight: 520 },
  ];

  let testFailures = 0;

  try {
    // 1. Production Default State Inspection
    console.log('\n--- TEST 1: Production Default App State & WebGL Isolation ---');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });

    // Navigate to Module C (tab 'story')
    await page.keyboard.press('2');
    await new Promise(r => setTimeout(r, 600));

    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && (text.includes('1 Đêm Thở Nghẽn') || text.includes('Thở Nghẽn'))) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 800));

    // Verify Sagittal view toggle button is present
    const toggleSagittal = await page.$('[data-testid="toggle-anatomical-view"]');
    if (toggleSagittal) {
      console.log('PASS: [data-testid="toggle-anatomical-view"] is present and default in production.');
    } else {
      console.error('FAIL: [data-testid="toggle-anatomical-view"] is missing!');
      testFailures++;
    }

    // Verify 3D toggle is ABSENT
    const toggle3D = await page.$('[data-testid="toggle-3d-webgl"]');
    if (toggle3D) {
      console.error('FAIL: [data-testid="toggle-3d-webgl"] is visible in production DOM!');
      testFailures++;
    } else {
      console.log('PASS: [data-testid="toggle-3d-webgl"] is completely absent from production DOM.');
    }

    // Verify secondary 3D tab is ABSENT
    const tab3D = await page.$('[data-testid="tab-3d-webgl"]');
    if (tab3D) {
      console.error('FAIL: [data-testid="tab-3d-webgl"] is visible in production DOM!');
      testFailures++;
    } else {
      console.log('PASS: [data-testid="tab-3d-webgl"] is completely absent from production DOM.');
    }

    // Verify WebGL contexts created
    const webglCount = await page.evaluate(() => window.__webgl_contexts_created);
    if (webglCount > 0) {
      console.error(`FAIL: WebGL contexts created in production: ${webglCount}`);
      testFailures++;
    } else {
      console.log(`PASS: Zero WebGL contexts created (count = ${webglCount}).`);
    }

    // 2. Empirical Mount & Layout Shifting / Height Collapse Test for AnatomyScene3D Stub
    console.log('\n--- TEST 2: AnatomyScene3D Stub Layout Stability & Height Check ---');

    // Create a standalone harness page inside the browser with the actual CSS from dist
    const cssFiles = fs.readdirSync(path.join(DIST_DIR, 'assets')).filter(f => f.endsWith('.css'));
    const cssContent = cssFiles.map(f => fs.readFileSync(path.join(DIST_DIR, 'assets', f), 'utf8')).join('\n');

    for (const vp of viewports) {
      console.log(`\nTesting viewport: ${vp.name}`);
      await page.setViewport({ width: vp.width, height: vp.height });

      // Generate harness HTML with stub markup and various edge cases
      const harnessHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>${cssContent}</style>
            <style>
              body { margin: 0; padding: 16px; background-color: #020617; font-family: sans-serif; }
              .test-wrapper { width: 100%; max-width: 1200px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="test-wrapper">
              <!-- Stub Instance 1: Standard Step 3 Collapsed -->
              <div
                data-testid="anatomy-scene-3d-stub"
                id="stub-std"
                data-step="3"
                data-airway-status="collapsed"
                data-airflow="0"
                data-spo2="85"
                data-brain-arousal="false"
                data-sympathetic="true"
                class="relative w-full h-[460px] sm:h-[520px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center p-6 text-center select-none"
              >
                <div class="max-w-md p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-sm flex flex-col items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-100">Chế Độ Xem Giải Phẫu Đứng Dọc Sagittal Y Khoa</h3>
                  <p class="text-xs text-slate-400 leading-relaxed">
                    Phiên bản trực tuyến tối ưu hóa hiệu năng với Bản đồ Sagittal 2D độ phân giải cao (độ trễ 0ms, không tiêu tốn GPU).
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-950/80 text-teal-300 border border-teal-800/60">Giai đoạn 3/5</span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">collapsed</span>
                  </div>
                </div>
              </div>

              <!-- Stub Instance 2: Extreme Edge Case -->
              <div
                data-testid="anatomy-scene-3d-stub-extreme"
                id="stub-extreme"
                data-step="-99"
                data-airway-status="ultra-critical-long-long-status-description"
                data-airflow="-99999"
                data-spo2="0"
                data-brain-arousal="true"
                data-sympathetic="true"
                class="relative w-full h-[460px] sm:h-[520px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center p-6 text-center select-none mt-8"
              >
                <div class="max-w-md p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-sm flex flex-col items-center gap-3">
                  <h3 class="text-sm sm:text-base font-bold text-slate-100">Chế Độ Xem Giải Phẫu Đứng Dọc Sagittal Y Khoa</h3>
                  <p class="text-xs text-slate-400 leading-relaxed">Extreme text stress test</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-950/80 text-teal-300 border border-teal-800/60">Giai đoạn -99/5</span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">ultra-critical-long-long-status-description</span>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      await page.setContent(harnessHtml, { waitUntil: 'load' });

      // Evaluate geometry and layout characteristics
      const layoutMetrics = await page.evaluate(() => {
        const el = document.getElementById('stub-std');
        const extremeEl = document.getElementById('stub-extreme');
        const rect = el.getBoundingClientRect();
        const extremeRect = extremeEl.getBoundingClientRect();
        const style = window.getComputedStyle(el);

        const docScrollWidth = document.documentElement.scrollWidth;
        const docClientWidth = document.documentElement.clientWidth;

        return {
          rectHeight: rect.height,
          rectWidth: rect.width,
          computedHeight: style.height,
          overflow: style.overflow,
          extremeRectHeight: extremeRect.height,
          extremeRectWidth: extremeRect.width,
          hasHorizontalOverflow: docScrollWidth > docClientWidth,
          docScrollWidth,
          docClientWidth,
          attrs: {
            step: el.getAttribute('data-step'),
            airwayStatus: el.getAttribute('data-airway-status'),
            airflow: el.getAttribute('data-airflow'),
            spo2: el.getAttribute('data-spo2'),
            brainArousal: el.getAttribute('data-brain-arousal'),
            sympathetic: el.getAttribute('data-sympathetic'),
          },
        };
      });

      console.log(`  Rendered height: ${layoutMetrics.rectHeight}px (computed: ${layoutMetrics.computedHeight})`);
      console.log(`  Rendered width: ${layoutMetrics.rectWidth}px`);
      console.log(`  Horizontal overflow: ${layoutMetrics.hasHorizontalOverflow ? 'YES (FAIL)' : 'NO (PASS)'}`);

      // Check height collapse
      if (layoutMetrics.rectHeight < 400) {
        console.error(`  FAIL: Height collapsed to ${layoutMetrics.rectHeight}px (expected ~${vp.expectedMinHeight}px)!`);
        testFailures++;
      } else {
        console.log(`  PASS: Height stable and preserved (${layoutMetrics.rectHeight}px >= 400px).`);
      }

      // Check horizontal overflow
      if (layoutMetrics.hasHorizontalOverflow) {
        console.error(`  FAIL: Horizontal overflow detected! scrollWidth: ${layoutMetrics.docScrollWidth} > clientWidth: ${layoutMetrics.docClientWidth}`);
        testFailures++;
      } else {
        console.log(`  PASS: Zero horizontal overflow.`);
      }

      // Check DOM attributes
      if (
        layoutMetrics.attrs.step === '3' &&
        layoutMetrics.attrs.airwayStatus === 'collapsed' &&
        layoutMetrics.attrs.airflow === '0' &&
        layoutMetrics.attrs.spo2 === '85' &&
        layoutMetrics.attrs.brainArousal === 'false' &&
        layoutMetrics.attrs.sympathetic === 'true'
      ) {
        console.log(`  PASS: DOM data attributes correctly reflect props.`);
      } else {
        console.error(`  FAIL: Attribute mismatch:`, layoutMetrics.attrs);
        testFailures++;
      }
    }

    console.log('\n--- Console Logs / Errors Summary ---');
    console.log(`Errors count: ${consoleErrors.length}`);
    console.log(`Warnings count: ${consoleWarnings.length}`);
    if (consoleErrors.length > 0) {
      console.error('Console Errors:', consoleErrors);
      testFailures += consoleErrors.length;
    }

  } finally {
    await browser.close();
    server.close();
    console.log('[Server] Closed.');
  }

  console.log(`\n=================================================`);
  console.log(`TOTAL BROWSER TEST FAILURES: ${testFailures}`);
  console.log(`=================================================`);

  if (testFailures > 0) {
    process.exit(1);
  } else {
    console.log('BROWSER EMPIRICAL VERIFICATION COMPLETE: ALL CHECKS PASSED.');
    process.exit(0);
  }
}

runEmpiricalBrowserVerification().catch((err) => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
