const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');
const { createServer } = require('vite');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const PROD_PORT = 3399;
const DEV_PORT = 5199;

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

async function navigateToModuleC(page) {
  // Use key shortcut '2' or click header button
  await page.keyboard.press('2');
  await sleep(400);

  // Fallback: click button containing '1 Đêm Thở Nghẽn'
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('1 Đêm Thở Nghẽn')) {
      await btn.click();
      await sleep(400);
      break;
    }
  }

  // Wait for Module C marker: toggle-anatomical-view or airway-caliber-gauge
  await page.waitForSelector('[data-testid="toggle-anatomical-view"]', { timeout: 5000 });
}

async function runEmpiricalChallenge() {
  console.log('====================================================');
  console.log('  CHALLENGER 1: EMPIRICAL STRESS & VERIFICATION SUITE');
  console.log('====================================================\n');

  const prodServer = createStaticServer();
  await new Promise((res) => prodServer.listen(PROD_PORT, res));
  console.log(`[PROD SERVER] Listening on http://localhost:${PROD_PORT}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  let prodVerdict = {
    webglContextCalls: [],
    rAFCallCount: 0,
    toggle3dPresent: false,
    tab3dPresent: false,
    sagittalViewPresent: false,
    stepCountTested: 0,
    allStepsZeroWebGL: true,
  };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Instrument page before any scripts load
    await page.evaluateOnNewDocument(() => {
      window.__webglCalls = [];
      window.__rafCount = 0;

      const origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        window.__webglCalls.push({ type, args, timestamp: Date.now() });
        return origGetContext.call(this, type, ...args);
      };

      const origRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = function(cb) {
        window.__rafCount++;
        return origRAF.call(window, cb);
      };
    });

    console.log('\n--- 1. Testing Production Build Mode (dist/) ---');
    await page.goto(`http://localhost:${PROD_PORT}/`, { waitUntil: 'networkidle0' });

    // Navigate to Module C
    await navigateToModuleC(page);

    // Check for 3D toggle button in DOM
    const toggle3d = await page.$('[data-testid="toggle-3d-webgl"]');
    prodVerdict.toggle3dPresent = !!toggle3d;

    // Check for secondary 3D tab in DOM
    const tab3d = await page.$('[data-testid="tab-3d-webgl"]');
    prodVerdict.tab3dPresent = !!tab3d;

    // Check for Sagittal toggle button
    const toggleSagittal = await page.$('[data-testid="toggle-anatomical-view"]');
    prodVerdict.sagittalViewPresent = !!toggleSagittal;

    // Check WebGL calls
    const initialContextCalls = await page.evaluate(() => window.__webglCalls);
    const initialWebGLCalls = initialContextCalls.filter(c => /webgl/i.test(c.type));
    prodVerdict.webglContextCalls.push(...initialWebGLCalls);

    console.log(`[PROD] Module C loaded:`);
    console.log(`       - 3D Toggle button present: ${prodVerdict.toggle3dPresent} (Expected: false)`);
    console.log(`       - 3D Tab present: ${prodVerdict.tab3dPresent} (Expected: false)`);
    console.log(`       - Sagittal toggle present: ${prodVerdict.sagittalViewPresent} (Expected: true)`);
    console.log(`       - WebGL getContext calls: ${initialWebGLCalls.length} (Expected: 0)`);

    // Verify AnatomicalSimulator / Sagittal Atlas view is mounted
    const caliberGauge = await page.$('[data-testid="airway-caliber-gauge"]');
    console.log(`       - Airway caliber gauge present: ${!!caliberGauge} (Expected: true)`);

    // Step through all 5 mechanism steps in Module C
    // In ModuleCView, there is handleNext or step buttons
    for (let s = 1; s <= 5; s++) {
      // Find button for next step or step indicators
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const title = await page.evaluate(el => el.getAttribute('title') || el.textContent, btn);
        if (title && (title.includes('Bước tiếp') || title.includes('Tiếp theo'))) {
          await btn.click();
          break;
        }
      }
      await sleep(200);

      const currentCalls = await page.evaluate(() => window.__webglCalls);
      const currentWebGL = currentCalls.filter(c => /webgl/i.test(c.type));
      if (currentWebGL.length > 0) {
        prodVerdict.allStepsZeroWebGL = false;
        prodVerdict.webglContextCalls.push(...currentWebGL);
      }
      prodVerdict.stepCountTested++;
    }

    console.log(`[PROD] Stepped through ${prodVerdict.stepCountTested} mechanism steps:`);
    console.log(`       - Total WebGL context calls across all steps: ${prodVerdict.webglContextCalls.length} (Expected: 0)`);
    console.log(`       - All steps zero WebGL: ${prodVerdict.allStepsZeroWebGL}`);

    await page.close();
  } finally {
    prodServer.close();
  }

  // --- 2. Testing Dev Server Mode to Verify Contrast ---
  console.log('\n--- 2. Testing Development Mode (Contrast Verification) ---');
  let devVerdict = {
    toggle3dPresent: false,
    tab3dPresent: false,
    canvasMountedOnToggle: false,
    resetButtonPresent: false
  };

  const devServer = await createServer({
    root: path.resolve(__dirname, '..'),
    mode: 'development',
    server: { port: DEV_PORT }
  });
  await devServer.listen();
  console.log(`[DEV SERVER] Listening on http://localhost:${DEV_PORT}`);

  try {
    const devPage = await browser.newPage();
    await devPage.setViewport({ width: 1440, height: 900 });

    await devPage.goto(`http://localhost:${DEV_PORT}/`, { waitUntil: 'networkidle0' });

    // Navigate to Module C
    await navigateToModuleC(devPage);

    // Check 3D toggle in DEV mode
    const devToggle3d = await devPage.$('[data-testid="toggle-3d-webgl"]');
    devVerdict.toggle3dPresent = !!devToggle3d;

    // Check secondary 3D tab in DEV mode
    const devTab3d = await devPage.$('[data-testid="tab-3d-webgl"]');
    devVerdict.tab3dPresent = !!devTab3d;

    console.log(`[DEV] Module C loaded:`);
    console.log(`      - 3D Toggle button present: ${devVerdict.toggle3dPresent} (Expected: true)`);
    console.log(`      - 3D Tab present: ${devVerdict.tab3dPresent} (Expected: true)`);

    // In DEV, click the 3D toggle button to mount the 3D WebGL scene
    if (devToggle3d) {
      await devToggle3d.click();
      await sleep(1500);

      // Check if real 3D container or canvas is mounted
      const canvasEl = await devPage.$('canvas');
      const resetBtn = await devPage.$('[data-testid="btn-reset-clinical-view"]');
      const stubEl = await devPage.$('[data-testid="anatomy-scene-3d-stub"]');

      devVerdict.canvasMountedOnToggle = !!canvasEl;
      devVerdict.resetButtonPresent = !!resetBtn;

      console.log(`[DEV] After clicking 3D toggle:`);
      console.log(`      - Canvas mounted: ${!!canvasEl} (Expected: true)`);
      console.log(`      - Clinical reset button present: ${!!resetBtn} (Expected: true)`);
      console.log(`      - Stub element present: ${!!stubEl} (Expected: false, real 3D should be loaded)`);
    }

    await devPage.close();
  } finally {
    await devServer.close();
  }

  await browser.close();

  // Evaluate overall empirical verdict
  console.log('\n====================================================');
  console.log('  EMPIRICAL CHALLENGER VERDICT ASSESSMENT');
  console.log('====================================================');

  const prodPassed = !prodVerdict.toggle3dPresent && 
                     !prodVerdict.tab3dPresent && 
                     prodVerdict.sagittalViewPresent && 
                     prodVerdict.webglContextCalls.length === 0 &&
                     prodVerdict.allStepsZeroWebGL;

  const devPassed = devVerdict.toggle3dPresent && 
                    devVerdict.tab3dPresent && 
                    devVerdict.canvasMountedOnToggle &&
                    devVerdict.resetButtonPresent;

  console.log(`Production Test Pass: ${prodPassed}`);
  console.log(`Development Test Pass: ${devPassed}`);

  if (prodPassed && devPassed) {
    console.log('\nVERDICT: >>> APPROVE <<<');
    process.exit(0);
  } else {
    console.error('\nVERDICT: >>> REQUEST_CHANGES <<<');
    process.exit(1);
  }
}

runEmpiricalChallenge().catch((e) => {
  console.error('Fatal challenge runner error:', e);
  process.exit(1);
});
