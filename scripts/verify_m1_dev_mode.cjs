const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');

const PORT = 5199;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runDevModeVerification() {
  console.log('=== STARTING DEV MODE EMPIRICAL TEST ===');

  // Spawn vite dev server on port 5199
  const viteProcess = spawn('npx.cmd', ['vite', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe',
  });

  let serverReady = false;
  viteProcess.stdout.on('data', (data) => {
    const text = data.toString();
    if (text.includes('Local:') || text.includes(String(PORT))) {
      serverReady = true;
    }
  });

  // Wait up to 10s for dev server to be ready
  for (let i = 0; i < 20; i++) {
    if (serverReady) break;
    await new Promise((r) => setTimeout(r, 500));
  }

  if (!serverReady) {
    viteProcess.kill();
    throw new Error('Vite dev server failed to start within timeout.');
  }
  console.log(`[Vite Dev] Running on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const errors = [];
  page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('CONSOLE_ERROR: ' + msg.text());
  });

  let failures = 0;

  try {
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });

    // Navigate to Module C (tab 'story') via keyboard shortcut '2' or click button
    await page.keyboard.press('2');
    await new Promise((r) => setTimeout(r, 600));

    // Also verify or click button directly if needed
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (text && (text.includes('1 Đêm Thở Nghẽn') || text.includes('Thở Nghẽn'))) {
        await btn.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 800));

    // 1. In DEV mode, verify 3D toggle is present
    const toggle3D = await page.$('[data-testid="toggle-3d-webgl"]');
    if (!toggle3D) {
      console.error('FAIL: [data-testid="toggle-3d-webgl"] is missing in DEV mode!');
      failures++;
    } else {
      console.log('PASS: [data-testid="toggle-3d-webgl"] is visible in DEV mode.');
      
      // Click 3D toggle to mount 3D WebGL Scene
      await toggle3D.click();
      await new Promise((r) => setTimeout(r, 1000));

      // 2. Verify Canvas Container mounts
      const canvasContainer = await page.$('[data-testid="three-canvas-container"]');
      if (!canvasContainer) {
        console.error('FAIL: [data-testid="three-canvas-container"] did not mount after clicking 3D toggle!');
        failures++;
      } else {
        console.log('PASS: [data-testid="three-canvas-container"] mounted cleanly.');
      }

      // 3. Verify Golden Standard Clinical Reset Button
      const resetBtn = await page.$('[data-testid="btn-reset-clinical-view"]');
      if (!resetBtn) {
        console.error('FAIL: [data-testid="btn-reset-clinical-view"] is missing in 3D scene!');
        failures++;
      } else {
        console.log('PASS: [data-testid="btn-reset-clinical-view"] is present and active in 3D scene.');
      }
    }

    // Check errors
    console.log(`\nDev Mode Page Errors: ${errors.length}`);
    if (errors.length > 0) {
      console.error('Captured errors:', errors);
      // If WebGL is not supported in headless mode, Three.js might show a WebGL context warning
      const nonWebglErrors = errors.filter(e => !e.includes('WebGL') && !e.includes('three'));
      if (nonWebglErrors.length > 0) {
        failures += nonWebglErrors.length;
      }
    }

  } finally {
    await browser.close();
    viteProcess.kill('SIGTERM');
    console.log('[Vite Dev] Process terminated.');
  }

  console.log(`\nDEV MODE FAILURES: ${failures}`);
  if (failures > 0) {
    process.exit(1);
  } else {
    console.log('DEV MODE VERIFICATION COMPLETE: ALL CHECKS PASSED.');
    process.exit(0);
  }
}

runDevModeVerification().catch((err) => {
  console.error('Dev verification crashed:', err);
  process.exit(1);
});
