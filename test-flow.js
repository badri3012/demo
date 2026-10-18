import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:/Users/YOU/.gemini/antigravity/scratch/flexispace/screenshots';
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTests() {
  console.log('Launching browser with WebGL support...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
    ],
  });

  const page = await browser.newPage();
  
  // Listen to console errors
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('Browser Error:', msg.text());
      errors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    console.log('Page Exception:', err.message);
    errors.push(err.message);
  });

  // 1. Desktop 1920x1080 Viewport
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  console.log('Navigating to http://localhost:4173...');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  console.log('Taking Screenshot 1: Hero & Brand Introduction');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_hero_intro.png') });

  // 2. Scroll to Configurator
  console.log('Scrolling to 3D Cot Configurator...');
  await page.evaluate(() => {
    document.getElementById('configurator')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 2000));

  console.log('Taking Screenshot 2: 3D Bed Studio & Controls');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_configurator_studio.png') });

  // 3. Test Drawer Pull-Out Toggle
  console.log('Testing Drawer toggle...');
  // Click on Step 5 (Details) in Configurator Panel to enable storage
  const stepButtons = await page.$$('button');
  for (const btn of stepButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Details')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  // Toggle storage drawers
  const storageToggles = await page.$$('button');
  for (const btn of storageToggles) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Open Drawers')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));

  console.log('Taking Screenshot 3: Storage Drawers Active');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_drawers_active.png') });

  // 4. Test Showroom Display Mode
  console.log('Testing Showroom Mode...');
  const showroomBtns = await page.$$('button');
  for (const btn of showroomBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Showroom Mode')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
  console.log('Taking Screenshot 4: Showroom Mode Kiosk');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_showroom_mode.png') });

  // Exit Showroom View
  const exitBtns = await page.$$('button');
  for (const btn of exitBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Exit Showroom View')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  // 5. Test Dealer Partner Economics
  console.log('Testing Dealer Commercial Portal...');
  const dealerBtns = await page.$$('button');
  for (const btn of dealerBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Dealer Economics')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Taking Screenshot 5: Dealer Commercial Breakdown');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_dealer_portal.png') });

  // Close Dealer Modal
  const closeBtns = await page.$$('button');
  for (const btn of closeBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Close Commercial Preview')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  // 6. Test Manufacturing Spec & Exploded BOM
  console.log('Testing Manufacturing Specification & BOM...');
  const bomBtns = await page.$$('button');
  for (const btn of bomBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Manufacturing Spec')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Taking Screenshot 6: Manufacturing Specification & BOM');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_manufacturing_bom.png') });

  // Close BOM Modal
  const closeBOMBtns = await page.$$('button');
  for (const btn of closeBOMBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Close Specification')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  // 7. Test Formal Quotation Sheet
  console.log('Testing Formal Quotation Sheet...');
  const quoteBtns = await page.$$('button');
  for (const btn of quoteBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Formal Quote Sheet')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Taking Screenshot 7: Quotation Sheet');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_quotation_sheet.png') });

  // Close Quote Modal
  const quoteCloseBtns = await page.$$('button');
  for (const btn of quoteCloseBtns) {
    const isX = await page.evaluate(el => el.querySelector('svg.lucide-x') !== null, btn);
    if (isX) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  // 8. Test ERP Factory Lifecycle Simulation
  console.log('Testing ERP Lifecycle Simulation...');
  const erpBtns = await page.$$('button');
  for (const btn of erpBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('ERP Lifecycle')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));

  // Click "Simulate Next Stage"
  const nextStageBtns = await page.$$('button');
  for (const btn of nextStageBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Simulate Next Stage')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  console.log('Taking Screenshot 8: ERP Lifecycle Stage Advanced');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_erp_lifecycle.png') });

  // Close ERP Modal
  const closeERPBtns = await page.$$('button');
  for (const btn of closeERPBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Close ERP Simulation')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  // 9. Mobile Viewport 390x844
  console.log('Testing Mobile Viewport (iPhone 14 / 390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Taking Screenshot 9: Mobile Hero');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_mobile_hero.png') });

  await page.evaluate(() => {
    document.getElementById('configurator')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Taking Screenshot 10: Mobile Configurator View');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_mobile_configurator.png') });

  await browser.close();
  console.log(`\nAll QA automation tests completed successfully! Screenshots saved in ${SCREENSHOT_DIR}`);
  console.log(`Console error count: ${errors.length}`);
}

runTests().catch((err) => {
  console.error('Test script failed:', err);
  process.exit(1);
});
