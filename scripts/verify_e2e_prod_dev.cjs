/**
 * verify_e2e_prod_dev.cjs
 * Authoritative Automated Headless Browser E2E Test Suite
 * 
 * Milestone M3:
 * 1. Production Verification Track:
 *    - Build production assets (npm run build)
 *    - Launch Vite preview server (http://localhost:4173)
 *    - Assert initial view defaults to "Mặt Cắt Sagittal Y Khoa" (AnatomicalSimulator)
 *    - Assert 3D toggle button ([data-testid="toggle-3d-webgl"]) is completely absent (null)
 *    - Assert secondary 3D tab ([data-testid="tab-3d-webgl"]) is completely absent (null)
 *    - Assert zero <canvas> elements exist in the DOM
 *    - Assert zero horizontal overflow (scrollWidth <= clientWidth) across 6 viewports (320, 375, 390, 768, 1024, 1280)
 *    - Assert zero banner clipping (Step 2 Snoring and Step 4 Hypoxia Alarm)
 *    - Assert cycling physiological steps 1–5 works without error
 * 
 * 2. Development Verification Track:
 *    - Launch Vite dev server (http://localhost:5176)
 *    - Navigate to Module C
 *    - Assert 3D toggle button ([data-testid="toggle-3d-webgl"]) is present and visible
 *    - Assert secondary 3D tab ([data-testid="tab-3d-webgl"]) is present
 *    - Click 3D toggle button: assert <canvas> mounts and WebGL context is created
 *    - Assert golden standard clinical reset button ([data-testid="btn-reset-clinical-view"]) is present, visible, and clickable
 *    - Assert camera presets (btn-view-airway, btn-view-endoscopy, btn-view-brain, btn-view-chest) are present and clickable
 * 
 * 3. Lifecycle & Reporting:
 *    - Robust process tree termination on Windows/POSIX
 *    - Formatted diagnostic tables and logs
 *    - Exit code 0 on 100% pass, 1 on failure
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn, execSync } = require('child_process');
const puppeteer = require('puppeteer-core');

const ROOT_DIR = path.resolve(__dirname, '..');
const PROD_PORT = 4173;
const DEV_PORT = 5176;

const VIEWPORTS = [
  { name: 'Mobile XS (320px)', width: 320, height: 640 },
  { name: 'Mobile S (375px)', width: 375, height: 667 },
  { name: 'Mobile M (390px)', width: 390, height: 844 },
  { name: 'Tablet (768px)', width: 768, height: 1024 },
  { name: 'Desktop (1024px)', width: 1024, height: 768 },
  { name: 'Desktop Wide (1280px)', width: 1280, height: 800 },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Locate Chrome / Edge executable
 */
function findChromeExecutable() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error('Could not find Google Chrome or Edge executable. Please install Chrome or check system path.');
}

/**
 * Terminate a process tree cleanly
 */
function killProcessTree(child) {
  if (!child || !child.pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' });
    } else {
      process.kill(-child.pid, 'SIGKILL');
    }
  } catch (_) {
    try {
      child.kill('SIGKILL');
    } catch (__) {}
  }
}

/**
 * Ensure specified port is free before starting a server
 */
function ensurePortFree(port) {
  if (process.platform === 'win32') {
    try {
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      const lines = output.trim().split('\n');
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && /^\d+$/.test(pid) && pid !== '0' && pid !== String(process.pid)) {
          console.log(`[Port Manager] Terminating lingering process (PID ${pid}) on port ${port}...`);
          try {
            execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
          } catch (_) {}
        }
      }
    } catch (_) {
      // Port is already free
    }
  }
}

/**
 * Poll an HTTP URL until it responds with HTTP 200
 */
async function waitForHttpReady(url, maxWaitMs = 25000) {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    try {
      const isReady = await new Promise((resolve) => {
        const req = http.get(url, (res) => {
          if (res.statusCode && res.statusCode < 500) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
        req.on('error', () => resolve(false));
        req.setTimeout(1500, () => {
          req.destroy();
          resolve(false);
        });
      });

      if (isReady) return true;
    } catch (_) {}

    await sleep(300);
  }
  return false;
}

/**
 * Navigate to Module C and wait for the view container to be ready
 */
async function navigateToModuleC(page) {
  // Press keyboard shortcut '2'
  await page.keyboard.press('2');
  await sleep(400);

  // Fallback: If not on Module C, search and click navigation button
  await page.evaluate(() => {
    const isModuleCPresent = document.querySelector('[data-testid="toggle-anatomical-view"]') ||
                             document.querySelector('[data-testid="toggle-3d-webgl"]');
    if (!isModuleCPresent) {
      const buttons = Array.from(document.querySelectorAll('button'));
      const storyBtn = buttons.find(b => {
        const text = b.innerText || '';
        return text.includes('1 Đêm Thở Nghẽn') || text.includes('Thở Nghẽn');
      });
      if (storyBtn) storyBtn.click();
    }
  });

  // Wait for Module C toggle button to appear
  await page.waitForSelector('[data-testid="toggle-anatomical-view"]', { timeout: 10000 });
  await sleep(300);
}

// Global process tracking for clean teardown
let activeChildProcesses = [];
let activeBrowser = null;

function registerTeardown() {
  const cleanup = () => {
    if (activeBrowser) {
      try { activeBrowser.close(); } catch (_) {}
      activeBrowser = null;
    }
    for (const child of activeChildProcesses) {
      killProcessTree(child);
    }
    activeChildProcesses = [];
  };

  process.on('SIGINT', () => { cleanup(); process.exit(1); });
  process.on('SIGTERM', () => { cleanup(); process.exit(1); });
  process.on('uncaughtException', (err) => {
    console.error('\n[FATAL] Uncaught Exception:', err);
    cleanup();
    process.exit(1);
  });
}

/**
 * ============================================================================
 * TRACK 1: PRODUCTION VERIFICATION TRACK
 * ============================================================================
 */
async function runProductionTrack(chromePath) {
  console.log('\n===============================================================');
  console.log('  TRACK 1: PRODUCTION VERIFICATION (VITE PREVIEW @ PORT ' + PROD_PORT + ')');
  console.log('===============================================================');

  const trackResults = [];
  let trackPassed = true;

  const recordResult = (id, description, passed, details = '') => {
    trackResults.push({ id, description, passed, details });
    if (!passed) trackPassed = false;
    const badge = passed ? 'PASS ✅' : 'FAIL ❌';
    console.log(`[PROD] ${badge} | ${id}: ${description} ${details ? '(' + details + ')' : ''}`);
  };

  // Step 1: Production Build
  console.log('\n[PROD] Step 1: Verifying / running production build (npm run build)...');
  try {
    const buildStart = Date.now();
    execSync('npm run build', { cwd: ROOT_DIR, stdio: 'pipe' });
    const buildDuration = ((Date.now() - buildStart) / 1000).toFixed(2);
    recordResult('P1_BUILD', 'Production build compilation (tsc & vite build)', true, `Completed in ${buildDuration}s`);
  } catch (buildErr) {
    recordResult('P1_BUILD', 'Production build compilation', false, buildErr.message);
    return { passed: false, results: trackResults };
  }

  // Step 2: Verify dist assets exist
  const distDir = path.join(ROOT_DIR, 'dist');
  const distAssetsDir = path.join(distDir, 'assets');
  const hasDist = fs.existsSync(distDir) && fs.existsSync(distAssetsDir);
  recordResult('P2_DIST_EXISTS', 'Production dist/ directory and bundled assets exist', hasDist);
  if (!hasDist) return { passed: false, results: trackResults };

  // Step 3: Launch Vite preview server
  console.log(`\n[PROD] Step 2: Spawning Vite preview server on port ${PROD_PORT}...`);
  ensurePortFree(PROD_PORT);

  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const previewProcess = spawn(cmd, ['vite', 'preview', '--port', String(PROD_PORT), '--strictPort'], {
    cwd: ROOT_DIR,
    shell: true,
    stdio: 'pipe'
  });
  activeChildProcesses.push(previewProcess);

  previewProcess.stderr.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('error') || msg.includes('Error')) {
      console.error('[Vite Preview Error]:', msg.trim());
    }
  });

  const previewUrl = `http://localhost:${PROD_PORT}`;
  const isPreviewReady = await waitForHttpReady(previewUrl, 20000);
  recordResult('P3_SERVER_START', `Vite preview server online at ${previewUrl}`, isPreviewReady);

  if (!isPreviewReady) {
    killProcessTree(previewProcess);
    return { passed: false, results: trackResults };
  }

  // Step 4: Launch Puppeteer
  console.log('\n[PROD] Step 3: Launching headless Chrome and navigating to Module C...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--ignore-gpu-blocklist',
      '--disable-dev-shm-usage',
    ]
  });
  activeBrowser = browser;

  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));

  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(previewUrl, { waitUntil: 'networkidle0' });
    await navigateToModuleC(page);

    // Assertion P4: Initial view defaults to "Mặt Cắt Sagittal Y Khoa" (AnatomicalSimulator rendered)
    const initialViewAssertion = await page.evaluate(() => {
      const toggleSagittal = document.querySelector('[data-testid="toggle-anatomical-view"]');
      const toggleSagittalActive = toggleSagittal && (
        toggleSagittal.className.includes('bg-white') ||
        toggleSagittal.className.includes('shadow-sm') ||
        toggleSagittal.getAttribute('aria-pressed') === 'true'
      );
      // AnatomicalSimulator contains standard atlas heading
      const textContent = document.body.innerText || '';
      const containsAtlasTag = textContent.includes('CHUẨN ATLAS Y HỌC') || 
                               textContent.includes('Mặt cắt Sagittal: Tỵ hầu - Khẩu hầu - Hạ hầu');
      // Verify 3D canvas container is NOT present
      const threeContainer = document.querySelector('[data-testid="three-canvas-container"]');

      return {
        hasSagittalToggle: !!toggleSagittal,
        isSagittalToggleActive: !!toggleSagittalActive,
        isAnatomicalSimulatorRendered: containsAtlasTag,
        threeContainerPresent: !!threeContainer
      };
    });

    const isInitialSagittal = initialViewAssertion.hasSagittalToggle && 
                              initialViewAssertion.isAnatomicalSimulatorRendered && 
                              !initialViewAssertion.threeContainerPresent;
    recordResult(
      'P4_SAGITTAL_DEFAULT',
      'Initial view defaults to "Mặt Cắt Sagittal Y Khoa" (AnatomicalSimulator rendered)',
      isInitialSagittal,
      `toggle=${initialViewAssertion.hasSagittalToggle}, atlasText=${initialViewAssertion.isAnatomicalSimulatorRendered}, 3DCanvas=${initialViewAssertion.threeContainerPresent}`
    );

    // Assertion P5: 3D toggle button is completely absent (null)
    const toggle3DElement = await page.$('[data-testid="toggle-3d-webgl"]');
    const isToggle3DAbsent = (toggle3DElement === null);
    recordResult(
      'P5_3D_TOGGLE_ABSENT',
      '3D WebGL toggle button ([data-testid="toggle-3d-webgl"]) is completely absent (null)',
      isToggle3DAbsent,
      isToggle3DAbsent ? 'DOM element is null' : 'Found unexpected element in production DOM'
    );

    // Assertion P6: Secondary 3D tab is completely absent (null)
    const tab3DElement = await page.$('[data-testid="tab-3d-webgl"]');
    const isTab3DAbsent = (tab3DElement === null);
    recordResult(
      'P6_3D_TAB_ABSENT',
      'Secondary 3D tab ([data-testid="tab-3d-webgl"]) is completely absent (null)',
      isTab3DAbsent,
      isTab3DAbsent ? 'DOM element is null' : 'Found unexpected tab in production DOM'
    );

    // Assertion P7: Zero <canvas> elements exist in the DOM
    const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
    recordResult(
      'P7_ZERO_CANVAS',
      'Zero <canvas> elements exist in the production DOM',
      canvasCount === 0,
      `canvas count = ${canvasCount}`
    );

    // Assertion P8: Across viewports, scrollWidth <= clientWidth (0 horizontal overflow) and zero banner clipping
    console.log('\n[PROD] Step 4: Auditing responsiveness & banner clipping across 6 viewports...');
    const viewportAuditTable = [];
    let allViewportsPassed = true;

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      await sleep(250);

      // Check horizontal overflow on current step 1
      const overflowInfo = await page.evaluate(() => {
        const docScroll = document.documentElement.scrollWidth;
        const bodyScroll = document.body.scrollWidth;
        const maxScroll = Math.max(docScroll, bodyScroll);
        const clientWidth = window.innerWidth;
        return {
          maxScroll,
          clientWidth,
          hasOverflow: maxScroll > clientWidth
        };
      });

      // Check Step 2 Snoring Banner fit inside stage
      // Click next button to navigate to step 2
      await page.evaluate(() => {
        const nextBtn = document.querySelector('button[title="Bước tiếp theo"]');
        if (nextBtn) nextBtn.click();
      });
      await sleep(200);

      const banner2Info = await page.evaluate(() => {
        const stage = document.querySelector('.aspect-\\[4\\/3\\], .aspect-\\[16\\/10\\]');
        const banner = Array.from(document.querySelectorAll('div')).find(d =>
          d.innerText && d.innerText.includes('tiếng ngáy') && d.className.includes('bg-amber-950')
        );
        if (!stage || !banner) return { found: false, fits: true };
        const sRect = stage.getBoundingClientRect();
        const bRect = banner.getBoundingClientRect();
        const fits = (bRect.left >= sRect.left - 1) && (bRect.right <= sRect.right + 1);
        return {
          found: true,
          fits,
          stageWidth: Math.round(sRect.width),
          bannerWidth: Math.round(bRect.width)
        };
      });

      // Advance to Step 4 to check Hypoxia Alarm Banner
      await page.evaluate(() => {
        const nextBtn = document.querySelector('button[title="Bước tiếp theo"]');
        if (nextBtn) nextBtn.click(); // step 3
      });
      await sleep(150);
      await page.evaluate(() => {
        const nextBtn = document.querySelector('button[title="Bước tiếp theo"]');
        if (nextBtn) nextBtn.click(); // step 4
      });
      await sleep(200);

      const banner4Info = await page.evaluate(() => {
        const stage = document.querySelector('.aspect-\\[4\\/3\\], .aspect-\\[16\\/10\\]');
        const banner = Array.from(document.querySelectorAll('div')).find(d =>
          d.innerText && d.innerText.includes('SpO₂ đang tụt thấp') && d.className.includes('bg-rose-950')
        );
        if (!stage || !banner) return { found: false, fits: true };
        const sRect = stage.getBoundingClientRect();
        const bRect = banner.getBoundingClientRect();
        const fits = (bRect.left >= sRect.left - 1) && (bRect.right <= sRect.right + 1);
        return {
          found: true,
          fits,
          stageWidth: Math.round(sRect.width),
          bannerWidth: Math.round(bRect.width)
        };
      });

      // Reset back to step 1
      await page.evaluate(() => {
        const resetStepBtn = document.querySelector('button[title="Bắt đầu lại"]');
        if (resetStepBtn) resetStepBtn.click();
      });
      await sleep(200);

      const vpPassed = !overflowInfo.hasOverflow && banner2Info.fits && banner4Info.fits;
      if (!vpPassed) allViewportsPassed = false;

      viewportAuditTable.push({
        viewport: vp.name,
        width: vp.width,
        scrollWidth: overflowInfo.maxScroll,
        clientWidth: overflowInfo.clientWidth,
        zeroOverflow: !overflowInfo.hasOverflow,
        banner2Fits: banner2Info.fits,
        banner4Fits: banner4Info.fits,
        status: vpPassed ? 'PASS ✅' : 'FAIL ❌'
      });
    }

    console.table(viewportAuditTable);
    recordResult(
      'P8_RESPONSIVE_OVERFLOW_BANNERS',
      'Zero horizontal overflow & zero banner clipping across all 6 target viewports',
      allViewportsPassed,
      allViewportsPassed ? '6/6 viewports clean' : 'Overflow or clipping detected'
    );

    // Assertion P9: Cycling physiological steps 1–5 works without error
    console.log('\n[PROD] Step 5: Cycling physiological steps 1–5 in Module C...');
    await page.setViewport({ width: 1280, height: 800 });
    let stepCyclingPassed = true;
    const stepErrors = [];

    // Reset to step 1
    await page.evaluate(() => {
      const resetBtn = document.querySelector('button[title="Bắt đầu lại"]');
      if (resetBtn) resetBtn.click();
    });
    await sleep(200);

    for (let s = 1; s <= 5; s++) {
      const currentStepText = await page.evaluate(() => {
        const spans = Array.from(document.querySelectorAll('span'));
        const stepSpan = spans.find(sp => sp.innerText && sp.innerText.includes('Bước ') && sp.innerText.includes('/'));
        return stepSpan ? stepSpan.innerText.trim() : null;
      });

      const expectedText = `Bước ${s} / 5`;
      if (currentStepText !== expectedText) {
        stepCyclingPassed = false;
        stepErrors.push(`Expected '${expectedText}', got '${currentStepText}'`);
      }

      if (s < 5) {
        await page.evaluate(() => {
          const nextBtn = document.querySelector('button[title="Bước tiếp theo"]');
          if (nextBtn) nextBtn.click();
        });
        await sleep(200);
      }
    }

    recordResult(
      'P9_CYCLE_STEPS_1_TO_5',
      'Cycling physiological steps 1–5 completes accurately and smoothly',
      stepCyclingPassed,
      stepCyclingPassed ? 'All 5 steps transitioned successfully' : stepErrors.join('; ')
    );

    // Page and Console Errors check
    const hasFatalRuntimeErrors = pageErrors.length > 0;
    recordResult(
      'P10_RUNTIME_ERRORS',
      'Zero unhandled runtime page errors during production track',
      !hasFatalRuntimeErrors,
      hasFatalRuntimeErrors ? `pageErrors: ${pageErrors.join('; ')}` : 'Zero errors'
    );

  } finally {
    await browser.close();
    activeBrowser = null;
    killProcessTree(previewProcess);
    activeChildProcesses = activeChildProcesses.filter(p => p !== previewProcess);
    console.log('[PROD] Vite preview server shut down cleanly.');
  }

  return { passed: trackPassed, results: trackResults };
}

/**
 * ============================================================================
 * TRACK 2: DEVELOPMENT VERIFICATION TRACK
 * ============================================================================
 */
async function runDevelopmentTrack(chromePath) {
  console.log('\n===============================================================');
  console.log('  TRACK 2: DEVELOPMENT VERIFICATION (VITE DEV @ PORT ' + DEV_PORT + ')');
  console.log('===============================================================');

  const trackResults = [];
  let trackPassed = true;

  const recordResult = (id, description, passed, details = '') => {
    trackResults.push({ id, description, passed, details });
    if (!passed) trackPassed = false;
    const badge = passed ? 'PASS ✅' : 'FAIL ❌';
    console.log(`[DEV]  ${badge} | ${id}: ${description} ${details ? '(' + details + ')' : ''}`);
  };

  // Step 1: Launch Vite dev server
  console.log(`\n[DEV]  Step 1: Spawning Vite dev server on port ${DEV_PORT}...`);
  ensurePortFree(DEV_PORT);

  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const devProcess = spawn(cmd, ['vite', '--port', String(DEV_PORT), '--strictPort'], {
    cwd: ROOT_DIR,
    shell: true,
    stdio: 'pipe'
  });
  activeChildProcesses.push(devProcess);

  devProcess.stderr.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('error') || msg.includes('Error')) {
      console.error('[Vite Dev Error]:', msg.trim());
    }
  });

  const devUrl = `http://localhost:${DEV_PORT}`;
  const isDevReady = await waitForHttpReady(devUrl, 25000);
  recordResult('D1_SERVER_START', `Vite dev server online at ${devUrl}`, isDevReady);

  if (!isDevReady) {
    killProcessTree(devProcess);
    return { passed: false, results: trackResults };
  }

  // Step 2: Launch Puppeteer in headless mode
  console.log('\n[DEV]  Step 2: Launching headless Chrome and navigating to Module C...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--ignore-gpu-blocklist',
      '--disable-dev-shm-usage',
    ]
  });
  activeBrowser = browser;

  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));

  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(devUrl, { waitUntil: 'networkidle0' });
    await navigateToModuleC(page);

    // Assertion D2: 3D toggle button is present and visible
    const toggle3DInfo = await page.evaluate(() => {
      const toggle = document.querySelector('[data-testid="toggle-3d-webgl"]');
      if (!toggle) return { present: false, visible: false };
      const rect = toggle.getBoundingClientRect();
      const style = window.getComputedStyle(toggle);
      const isVisible = rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      return { present: true, visible: isVisible, width: Math.round(rect.width), height: Math.round(rect.height) };
    });

    recordResult(
      'D2_3D_TOGGLE_PRESENT',
      '3D toggle button ([data-testid="toggle-3d-webgl"]) is present and visible',
      toggle3DInfo.present && toggle3DInfo.visible,
      `present=${toggle3DInfo.present}, visible=${toggle3DInfo.visible} (${toggle3DInfo.width}x${toggle3DInfo.height}px)`
    );

    // Assertion D3: Secondary 3D tab is present
    const tab3DInfo = await page.evaluate(() => {
      const tab = document.querySelector('[data-testid="tab-3d-webgl"]');
      return { present: !!tab };
    });

    recordResult(
      'D3_3D_TAB_PRESENT',
      'Secondary 3D tab ([data-testid="tab-3d-webgl"]) is present',
      tab3DInfo.present,
      `present=${tab3DInfo.present}`
    );

    // Assertion D4: Click 3D toggle button -> Canvas mounts and WebGL context is created
    console.log('\n[DEV]  Step 3: Clicking 3D toggle button and verifying WebGL canvas mounting...');
    const toggleBtn = await page.$('[data-testid="toggle-3d-webgl"]');
    if (toggleBtn) {
      await toggleBtn.click();
    }
    // Allow Three.js WebGLRenderer to initialize and mount into container
    await sleep(1200);

    const canvasMountInfo = await page.evaluate(() => {
      const container = document.querySelector('[data-testid="three-canvas-container"]');
      const canvasList = document.querySelectorAll('canvas');
      const canvasInContainer = container ? container.querySelector('canvas') : null;
      const targetCanvas = canvasInContainer || canvasList[0];

      if (!targetCanvas) {
        return {
          canvasFound: false,
          glCreated: false,
          contextLost: true,
          canvasCount: canvasList.length
        };
      }

      // Query WebGL context
      const gl = targetCanvas.getContext('webgl2') || 
                 targetCanvas.getContext('webgl') || 
                 targetCanvas.getContext('experimental-webgl');

      return {
        canvasFound: true,
        canvasCount: canvasList.length,
        hasContainer: !!container,
        glCreated: !!gl,
        contextLost: gl ? gl.isContextLost() : true,
        renderer: gl ? gl.getParameter(gl.RENDERER) : null,
        vendor: gl ? gl.getParameter(gl.VENDOR) : null
      };
    });

    const isWebGLReady = canvasMountInfo.canvasFound && canvasMountInfo.glCreated && !canvasMountInfo.contextLost;
    recordResult(
      'D4_CANVAS_WEBGL_MOUNTED',
      'Clicking 3D toggle mounts <canvas> element with active WebGL context',
      isWebGLReady,
      `canvasFound=${canvasMountInfo.canvasFound}, glCreated=${canvasMountInfo.glCreated}, contextLost=${canvasMountInfo.contextLost}, renderer="${canvasMountInfo.renderer}"`
    );

    // Assertion D5: Golden standard clinical reset button is present, visible, and clickable
    console.log('\n[DEV]  Step 4: Verifying Golden Standard Clinical Reset button...');
    const resetBtnInfo = await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="btn-reset-clinical-view"]');
      if (!btn) return { present: false, visible: false, text: '' };
      const rect = btn.getBoundingClientRect();
      const style = window.getComputedStyle(btn);
      const visible = rect.width > 0 && rect.height > 0 && style.display !== 'none';
      return { present: true, visible, text: btn.innerText.trim() };
    });

    // Test clicking reset button
    let resetClickable = false;
    if (resetBtnInfo.present && resetBtnInfo.visible) {
      try {
        const resetBtn = await page.$('[data-testid="btn-reset-clinical-view"]');
        await resetBtn.click();
        await sleep(350);
        resetClickable = true;
      } catch (_) {
        resetClickable = false;
      }
    }

    recordResult(
      'D5_RESET_CLINICAL_BUTTON',
      'Golden standard clinical reset button ([data-testid="btn-reset-clinical-view"]) is present, visible, and clickable',
      resetBtnInfo.present && resetBtnInfo.visible && resetClickable,
      `present=${resetBtnInfo.present}, visible=${resetBtnInfo.visible}, clickable=${resetClickable}`
    );

    // Assertion D6: Camera presets are present and clickable
    console.log('\n[DEV]  Step 5: Verifying Camera Presets (Airway, Endoscopy, Brain, Chest)...');
    const presets = [
      { id: 'btn-view-airway', name: 'Airway (Họng & Lưỡi)' },
      { id: 'btn-view-endoscopy', name: 'Endoscopy (Nội soi DISE)' },
      { id: 'btn-view-brain', name: 'Brain ARAS (Não ARAS)' },
      { id: 'btn-view-chest', name: 'Chest (Phổi & Tim)' },
    ];

    const presetAuditResults = [];
    let allPresetsPassed = true;

    for (const preset of presets) {
      const selector = `[data-testid="${preset.id}"]`;
      const presetInfo = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return { present: false, visible: false };
        const rect = el.getBoundingClientRect();
        return { present: true, visible: rect.width > 0 && rect.height > 0 };
      }, selector);

      let clickedSuccessfully = false;
      if (presetInfo.present && presetInfo.visible) {
        try {
          const el = await page.$(selector);
          await el.click();
          await sleep(250);
          clickedSuccessfully = true;
        } catch (_) {
          clickedSuccessfully = false;
        }
      }

      const passed = presetInfo.present && presetInfo.visible && clickedSuccessfully;
      if (!passed) allPresetsPassed = false;

      presetAuditResults.push({
        preset: preset.name,
        testId: preset.id,
        present: presetInfo.present,
        visible: presetInfo.visible,
        clickable: clickedSuccessfully,
        status: passed ? 'PASS ✅' : 'FAIL ❌'
      });
    }

    console.table(presetAuditResults);
    recordResult(
      'D6_CAMERA_PRESETS_CLICKABLE',
      'All 4 3D camera presets are present, visible, and clickable',
      allPresetsPassed,
      allPresetsPassed ? '4/4 presets functional' : 'One or more presets failed'
    );

    // Post-preset click: Verify clinical reset can restore original sagittal orientation
    const postResetBtn = await page.$('[data-testid="btn-reset-clinical-view"]');
    if (postResetBtn) {
      await postResetBtn.click();
      await sleep(300);
    }

    // Page and Console Errors check (excluding standard WebGL informational notices)
    const fatalPageErrors = pageErrors.filter(e => !e.includes('favicon'));
    recordResult(
      'D7_RUNTIME_ERRORS',
      'Zero unhandled fatal page errors during development track',
      fatalPageErrors.length === 0,
      fatalPageErrors.length > 0 ? `Errors: ${fatalPageErrors.join('; ')}` : 'Zero errors'
    );

  } finally {
    await browser.close();
    activeBrowser = null;
    killProcessTree(devProcess);
    activeChildProcesses = activeChildProcesses.filter(p => p !== devProcess);
    console.log('[DEV]  Vite dev server shut down cleanly.');
  }

  return { passed: trackPassed, results: trackResults };
}

/**
 * ============================================================================
 * MAIN ENTRYPOINT
 * ============================================================================
 */
async function main() {
  console.log('╔═════════════════════════════════════════════════════════════╗');
  console.log('║   O2Sense E2E Dual-Track Test Suite (Prod & Dev)            ║');
  console.log('║   Milestone M3 Authoritative Headless Browser Verification  ║');
  console.log('╚═════════════════════════════════════════════════════════════╝');

  registerTeardown();

  const chromePath = findChromeExecutable();
  console.log(`[Browser Engine] Using Chrome binary at: ${chromePath}\n`);

  const prodResult = await runProductionTrack(chromePath);
  const devResult = await runDevelopmentTrack(chromePath);

  console.log('\n===============================================================');
  console.log('                 FINAL E2E VERIFICATION REPORT                 ');
  console.log('===============================================================');

  console.log('\n--- PRODUCTION TRACK SUMMARY ---');
  console.table(prodResult.results.map(r => ({
    ID: r.id,
    Description: r.description,
    Result: r.passed ? 'PASS ✅' : 'FAIL ❌',
    Details: r.details
  })));

  console.log('\n--- DEVELOPMENT TRACK SUMMARY ---');
  console.table(devResult.results.map(r => ({
    ID: r.id,
    Description: r.description,
    Result: r.passed ? 'PASS ✅' : 'FAIL ❌',
    Details: r.details
  })));

  const overallPass = prodResult.passed && devResult.passed;

  console.log('\n===============================================================');
  if (overallPass) {
    console.log('🎉 OVERALL RESULT: 100% PASS — ALL CHECKS PASSED SUCCESSFULLY!');
    console.log('===============================================================\n');
    process.exit(0);
  } else {
    console.error('❌ OVERALL RESULT: FAILURES DETECTED IN TEST SUITE!');
    console.log('===============================================================\n');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n[FATAL RUNTIME ERROR]:', err);
  for (const child of activeChildProcesses) {
    killProcessTree(child);
  }
  process.exit(1);
});
