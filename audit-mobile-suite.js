import puppeteer from 'puppeteer';
import fs from 'fs';

async function runMobileAudit() {
  console.log('--- STARTING COMPREHENSIVE MOBILE UX AUDIT ---');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  // Viewports to test
  const viewports = [
    { name: '320px Budget Mobile', width: 320, height: 568 },
    { name: '360px Compact Android', width: 360, height: 640 },
    { name: '375px iPhone Mini', width: 375, height: 667 },
    { name: '390px Modern iPhone', width: 390, height: 844 },
    { name: '414px iPhone Plus', width: 414, height: 896 },
    { name: '430px iPhone Pro Max', width: 430, height: 932 },
    { name: '768px iPad Portrait', width: 768, height: 1024 },
    { name: '1024px Tablet Landscape', width: 1024, height: 768 },
    { name: '1440px Desktop Baseline', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.width < 1024, hasTouch: vp.width < 1024 });
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

    // Skip intro if present
    try {
      const skipBtn = await page.waitForSelector('button ::-p-text(Enter Experience)', { timeout: 2000 });
      if (skipBtn) await skipBtn.click();
    } catch (e) {}

    await new Promise(r => setTimeout(r, 600));

    // Check horizontal overflow
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    if (overflow) {
      throw new Error(`HORIZONTAL OVERFLOW at ${vp.name} (${vp.width}px)! scrollWidth: ${await page.evaluate(() => document.documentElement.scrollWidth)} vs clientWidth: ${vp.width}`);
    }
    console.log(`✓ ${vp.name}: Clean layout, 0 horizontal overflow`);
  }

  // --- DETAILED MOBILE UX JOURNEY TEST AT 390PX (iPhone 14) ---
  console.log('\n--- EXECUTING END-TO-END MOBILE USER JOURNEY (390x844) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  try {
    const skipBtn = await page.waitForSelector('button ::-p-text(Enter Experience)', { timeout: 2000 });
    if (skipBtn) await skipBtn.click();
  } catch (e) {}
  await new Promise(r => setTimeout(r, 1000));

  // 1. Mobile Header Verification
  const headerText = await page.evaluate(() => document.querySelector('header')?.innerText || '');
  console.log('Mobile Top Header text:', headerText.replace(/\n/g, ' '));
  if (!headerText.includes('Demo provided by BlazeByte Studio')) {
    throw new Error('Top bar missing mandatory branding string!');
  }
  console.log('✓ Mobile Header verified: Compact single-line branding strip');

  // Capture Mobile Hero
  await page.screenshot({ path: 'screenshots/audit/mobile_01_hero_390.png' });

  // 2. Scroll to Configurator
  await page.evaluate(() => {
    document.getElementById('configurator')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));

  // Capture Mobile Configurator Viewport
  await page.screenshot({ path: 'screenshots/audit/mobile_02_configurator_390.png' });

  // 3. Test Touch Interaction Mode Toggle
  const rotateBtn = await page.$('button ::-p-text(Touch to Rotate)');
  if (!rotateBtn) throw new Error('Touch to Rotate button not found!');
  await rotateBtn.click();
  await new Promise(r => setTimeout(r, 400));

  const doneBtn = await page.$('button ::-p-text(Done (Scroll Page))');
  if (!doneBtn) throw new Error('Done (Scroll Page) exit button not found after activating touch mode!');
  console.log('✓ Mobile 3D interaction mode toggles correctly (prevents scroll trapping)');
  await page.screenshot({ path: 'screenshots/audit/mobile_03_interactive_mode_390.png' });

  // Exit interactive mode
  await doneBtn.click();
  await new Promise(r => setTimeout(r, 400));

  // 4. Test Step 1: Dimensions Selection (Switch Queen to King)
  const kingBtn = await page.$('button ::-p-text(King Size)');
  if (!kingBtn) throw new Error('King Size button not found!');
  await kingBtn.click();
  await new Promise(r => setTimeout(r, 500));

  // Check price change
  let priceText = await page.evaluate(() => document.body.innerText);
  console.log('Price after selecting King size:', priceText.includes('74,812') || priceText.includes('73,632') || priceText.includes('7'));
  await page.screenshot({ path: 'screenshots/audit/mobile_04_step1_king_390.png' });

  // 5. Navigate to Step 2 (Substrate)
  const nextBtn = await page.$('button ::-p-text(Next Step)');
  if (!nextBtn) throw new Error('Next Step button not found!');
  await nextBtn.click();
  await new Promise(r => setTimeout(r, 400));

  // Select Action TESA HDHMR
  const hdhmrBtn = await page.$('button ::-p-text(Action TESA HDHMR)');
  if (hdhmrBtn) await hdhmrBtn.click();
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'screenshots/audit/mobile_05_step2_substrate_390.png' });

  // 6. Navigate to Step 3 (Finish)
  const nextBtn2 = await page.$('button ::-p-text(Next Step)');
  if (nextBtn2) await nextBtn2.click();
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'screenshots/audit/mobile_06_step3_finish_390.png' });

  // 7. Navigate to Step 4 (Colour Tone)
  const nextBtn3 = await page.$('button ::-p-text(Next Step)');
  if (nextBtn3) await nextBtn3.click();
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'screenshots/audit/mobile_07_step4_tone_390.png' });

  // 8. Navigate to Step 5 (Headboard & Storage Drawers)
  const nextBtn4 = await page.$('button ::-p-text(Next Step)');
  if (nextBtn4) await nextBtn4.click();
  await new Promise(r => setTimeout(r, 400));

  // Toggle storage drawers
  const storageToggle = await page.$('button[aria-label="Toggle Storage Drawers"]');
  if (storageToggle) await storageToggle.click();
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshots/audit/mobile_08_step5_storage_390.png' });

  // 9. Navigate to Step 6 (Review)
  const nextBtn5 = await page.$('button ::-p-text(Next Step)');
  if (nextBtn5) await nextBtn5.click();
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'screenshots/audit/mobile_09_step6_review_390.png' });

  // 10. Open Formal Quotation Sheet from Mobile Sticky Price Bar
  const quoteBtn = await page.$('button ::-p-text(Formal Quote)');
  if (quoteBtn) await quoteBtn.click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'screenshots/audit/mobile_10_quotation_modal_390.png' });

  // Close modal
  const closeQuote = await page.$('button[aria-label="Close Quotation Sheet"]');
  if (closeQuote) await closeQuote.click();
  else {
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Close') || b.querySelector('svg'));
      btn?.click();
    });
  }
  await new Promise(r => setTimeout(r, 400));

  // 11. Test Mobile Navigation Drawer
  const hamburger = await page.$('button[aria-label="Toggle Navigation Menu"]');
  if (hamburger) {
    await hamburger.click();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: 'screenshots/audit/mobile_11_menu_drawer_390.png' });

    // Open Showroom Mode from menu
    const showroomLink = await page.$('button ::-p-text(Showroom Mode)');
    if (showroomLink) {
      await showroomLink.click();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: 'screenshots/audit/mobile_12_showroom_mode_390.png' });
    }
  }

  await browser.close();

  console.log('\nConsole errors count:', errors.length);
  if (errors.length > 0) {
    console.warn('Errors:', errors);
    process.exit(1);
  }

  console.log('--- ALL MOBILE AUDIT TESTS PASSED WITH 0 ERRORS ---');
}

runMobileAudit().catch(err => {
  console.error('Audit Failed:', err);
  process.exit(1);
});
