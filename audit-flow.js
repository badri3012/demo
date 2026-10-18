import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const AUDIT_DIR = 'C:/Users/YOU/.gemini/antigravity/scratch/flexispace/screenshots/audit';
if (!fs.existsSync(AUDIT_DIR)) {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
}

async function runAudit() {
  console.log('--- STARTING COMPREHENSIVE BLAZEBYTE STUDIO & FLEXISPACE QUALITY AUDIT ---');

  const launchOpts = {
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
    ],
  };

  // --- PART 1: DESKTOP EXPERIENCES (1920x1080) ---
  console.log('Launching browser for Desktop Audit (1920x1080)...');
  const browser = await puppeteer.launch(launchOpts);
  const page = await browser.newPage();
  const consoleLogs = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('Console Error:', msg.text());
      consoleLogs.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    console.log('Page Exception:', err.message);
    pageErrors.push(err.message);
  });

  await page.setViewport({ width: 1920, height: 1080 });
  console.log('Navigating to root to capture BlazeByte Studio Luxury Intro...');
  await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
  
  // Wait 1.0s for the intro to be fully visible
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Capturing: audit_01_blazebyte_intro.png');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'audit_01_blazebyte_intro.png') });

  // Wait for intro transition to fade out and reveal main furniture experience
  await new Promise((r) => setTimeout(r, 2200));

  // 2. Flexispace Homepage Hero
  console.log('Capturing: audit_02_flexispace_homepage.png');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'audit_02_flexispace_homepage.png') });

  // 3. Furniture Catalogue Experience
  console.log('Scrolling to Furniture Catalogue section...');
  await page.evaluate(() => {
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));
  console.log('Capturing: audit_03_furniture_catalogue.png');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'audit_03_furniture_catalogue.png') });

  // 4. Main 3D Configurator Studio
  console.log('Scrolling to 3D Bed Configurator Studio...');
  await page.evaluate(() => {
    document.getElementById('configurator')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1500));
  console.log('Capturing: audit_04_main_3d_configurator.png');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'audit_04_main_3d_configurator.png') });

  // 5. Material Selection (Step 2: Substrate Core)
  console.log('Testing Material selection (Step 2)...');
  const stepButtons = await page.$$('button');
  for (const btn of stepButtons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Substrate')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Capturing: audit_05_material_selection.png');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'audit_05_material_selection.png') });

  // 6. Finish Selection (Step 3: Finish Series)
  console.log('Testing Finish series selection (Step 3)...');
  const finishButtons = await page.$$('button');
  for (const btn of finishButtons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Finish')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Capturing: audit_06_finish_selection.png');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'audit_06_finish_selection.png') });

  // 7. Storage Configuration & Drawer Animation (Step 5: Details)
  console.log('Testing Storage details & pull-out drawer (Step 5)...');
  const detailButtons = await page.$$('button');
  for (const btn of detailButtons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Details')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  // Toggle storage drawers to open
  const openDrawerBtns = await page.$$('button');
  for (const btn of openDrawerBtns) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Open Drawers')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));
  console.log('Capturing: audit_07_storage_configuration.png');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'audit_07_storage_configuration.png') });

  // 8. Pricing Breakdown & Review (Step 6)
  console.log('Testing Configuration Review & Pricing Summary (Step 6)...');
  const reviewButtons = await page.$$('button');
  for (const btn of reviewButtons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Review')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Capturing: audit_08_pricing_breakdown.png');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'audit_08_pricing_breakdown.png') });

  // 9. Formal Quotation Sheet Modal
  console.log('Opening Formal Quotation Sheet...');
  const quoteBtns = await page.$$('button');
  for (const btn of quoteBtns) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Formal Quote Sheet')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));
  console.log('Capturing: audit_09_configuration_summary.png');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'audit_09_configuration_summary.png') });

  // Close Quote Modal via Escape key
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 800));

  // 10. Dealer Partner Commercial Portal
  console.log('Opening Dealer Commercial Portal...');
  const dealerBtns = await page.$$('button');
  for (const btn of dealerBtns) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Dealer Economics')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));
  console.log('Capturing: audit_10_dealer_preview.png');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'audit_10_dealer_preview.png') });

  // Close Dealer Modal
  const closeDealerBtns = await page.$$('button');
  for (const btn of closeDealerBtns) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Close Commercial Preview')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  // 11. Showroom Display Mode
  console.log('Opening Showroom Display Mode...');
  const showroomBtns = await page.$$('button');
  for (const btn of showroomBtns) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Showroom Mode')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
  console.log('Capturing: audit_11_showroom_mode.png');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'audit_11_showroom_mode.png') });

  // Exit Showroom
  const exitShowroomBtns = await page.$$('button');
  for (const btn of exitShowroomBtns) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Exit Showroom View')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  // 12. Manufacturing Specification & Exploded BOM
  console.log('Opening Manufacturing Specification & BOM...');
  const bomBtns = await page.$$('button');
  for (const btn of bomBtns) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Manufacturing Spec')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));
  console.log('Capturing: audit_12_manufacturing_spec.png');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'audit_12_manufacturing_spec.png') });

  // Close BOM
  const closeBOMBtns = await page.$$('button');
  for (const btn of closeBOMBtns) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Close Specification')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  // 13. Simulated ERP Factory Lifecycle
  console.log('Opening ERP Lifecycle simulation...');
  const erpBtns = await page.$$('button');
  for (const btn of erpBtns) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('ERP Lifecycle')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));

  // Simulate Next Stage
  const nextStageBtns = await page.$$('button');
  for (const btn of nextStageBtns) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Simulate Next Stage')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));
  console.log('Capturing: audit_13_erp_workflow.png');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'audit_13_erp_workflow.png') });

  await browser.close();

  // --- PART 2: MOBILE & LARGE SCREEN VIEWPORTS ---
  console.log('\nLaunching browser for Mobile Viewport (iPhone 14 / 390x844)...');
  const mobileBrowser = await puppeteer.launch(launchOpts);
  const mobilePage = await mobileBrowser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mobilePage.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2600)); // wait for intro to pass

  await mobilePage.evaluate(() => {
    document.getElementById('configurator')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));
  console.log('Capturing: audit_14_mobile_configurator.png');
  await mobilePage.screenshot({ path: path.join(AUDIT_DIR, 'audit_14_mobile_configurator.png') });
  await mobileBrowser.close();

  // --- PART 3: LARGE-SCREEN 2560x1440 WIDESCREEN SHOWROOM ---
  console.log('\nLaunching browser for Large-Screen Viewport (2560x1440 2K Kiosk)...');
  const largeBrowser = await puppeteer.launch(launchOpts);
  const largePage = await largeBrowser.newPage();
  await largePage.setViewport({ width: 2560, height: 1440 });
  await largePage.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2600));

  const openShowroomLg = await largePage.$$('button');
  for (const btn of openShowroomLg) {
    const text = await largePage.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Showroom Mode')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
  console.log('Capturing: audit_15_largescreen_showroom.png');
  await largePage.screenshot({ path: path.join(AUDIT_DIR, 'audit_15_largescreen_showroom.png') });

  // 16. Multi-Viewport Responsive Sanity Checks (360px, 430px, 768px, 1024px, 1440px)
  const testViewports = [
    { name: '360px_small_mobile', width: 360, height: 740 },
    { name: '430px_pro_mobile', width: 430, height: 932 },
    { name: '768px_tablet', width: 768, height: 1024 },
    { name: '1024px_ipad_pro', width: 1024, height: 1366 },
    { name: '1440px_macbook', width: 1440, height: 900 },
  ];

  for (const vp of testViewports) {
    await largePage.setViewport({ width: vp.width, height: vp.height });
    await largePage.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 500));
    const hasHorizontalScroll = await largePage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}) - Horizontal Overflow: ${hasHorizontalScroll ? 'FAIL (overflow detected)' : 'PASS (no overflow)'}`);
  }

  await largeBrowser.close();

  console.log('\n--- QUALITY AUDIT RUN FINISHED ---');
  console.log(`Console errors recorded: ${consoleLogs.length}`);
  console.log(`Page exceptions recorded: ${pageErrors.length}`);
  console.log(`Audit screenshots stored in: ${AUDIT_DIR}`);
}

runAudit().catch((err) => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
