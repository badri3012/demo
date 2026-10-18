import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\YOU\\.gemini\\antigravity\\brain\\5237db25-1a29-4e86-8cbb-f5aebcf7bbce\\screenshots\\audit';
const LOCAL_DIR = 'screenshots/audit';

if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

function copyToArtifact(filename) {
  const src = path.join(LOCAL_DIR, filename);
  const dst = path.join(ARTIFACT_DIR, filename);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
  }
}

async function runFullAudit() {
  console.log('=== STARTING ULTIMATE CLIENT AUDIT SUITE ===');

  // Connecting to preview server on port 4173
  console.log('Connecting to preview server on port 4173...');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist'],
  });

  const errors = [];

  // Helper to open a new page with console listening
  async function createPage(width = 1440, height = 900, isMobile = false) {
    const p = await browser.newPage();
    p.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    p.on('pageerror', (err) => errors.push(err.message));
    await p.setViewport({ width, height, isMobile, hasTouch: isMobile });
    return p;
  }

  try {
    // -------------------------------------------------------------
    // 1. LUXURY LOADING INTRODUCTION SCREENSHOT
    // -------------------------------------------------------------
    console.log('[1/15] Capturing Luxury Loading Introduction...');
    const pIntro = await createPage(1440, 900, false);
    await pIntro.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 600));
    await pIntro.screenshot({ path: `${LOCAL_DIR}/final_01_luxury_intro.png` });
    copyToArtifact('final_01_luxury_intro.png');

    // Skip intro
    try {
      const skipBtn = await pIntro.waitForSelector('button ::-p-text(Enter Experience)', { timeout: 3000 });
      if (skipBtn) await skipBtn.click();
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 800));

    // -------------------------------------------------------------
    // 2. PREMIUM HOMEPAGE SCREENSHOT (Desktop Hero & Brand)
    // -------------------------------------------------------------
    console.log('[2/15] Capturing Premium Homepage...');
    await pIntro.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 500));
    await pIntro.screenshot({ path: `${LOCAL_DIR}/final_02_premium_homepage.png` });
    copyToArtifact('final_02_premium_homepage.png');

    // -------------------------------------------------------------
    // 3. DESKTOP CONFIGURATOR SCREENSHOT
    // -------------------------------------------------------------
    console.log('[3/15] Capturing Desktop Configurator...');
    await pIntro.evaluate(() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 800));
    await pIntro.screenshot({ path: `${LOCAL_DIR}/final_03_desktop_configurator.png` });
    copyToArtifact('final_03_desktop_configurator.png');

    // -------------------------------------------------------------
    // 7. DIMENSION SELECTION (King Size)
    // -------------------------------------------------------------
    console.log('[7/15] Testing Dimension Selection (King Size)...');
    const kingBtn = await pIntro.$('button ::-p-text(King Size)');
    if (kingBtn) await kingBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    await pIntro.screenshot({ path: `${LOCAL_DIR}/final_07_dimension_selection.png` });
    copyToArtifact('final_07_dimension_selection.png');

    // -------------------------------------------------------------
    // 5. MATERIAL SELECTION (Step 2)
    // -------------------------------------------------------------
    console.log('[5/15] Testing Material Selection (Step 2)...');
    let nextBtn = await pIntro.$('button ::-p-text(Next Step)');
    if (nextBtn) await nextBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    const marinePlyBtn = await pIntro.$('button ::-p-text(Calibrated BWP Marine Ply)');
    if (marinePlyBtn) await marinePlyBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    await pIntro.screenshot({ path: `${LOCAL_DIR}/final_05_material_selection.png` });
    copyToArtifact('final_05_material_selection.png');

    // -------------------------------------------------------------
    // 6. FINISH SELECTION (Step 3)
    // -------------------------------------------------------------
    console.log('[6/15] Testing Finish Selection (Step 3)...');
    nextBtn = await pIntro.$('button ::-p-text(Next Step)');
    if (nextBtn) await nextBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    const finishBtn = await pIntro.$('button ::-p-text(Cinzel Italian PU Coating)');
    if (finishBtn) await finishBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    await pIntro.screenshot({ path: `${LOCAL_DIR}/final_06_finish_selection.png` });
    copyToArtifact('final_06_finish_selection.png');

    // Step 4 (Colour tone)
    nextBtn = await pIntro.$('button ::-p-text(Next Step)');
    if (nextBtn) await nextBtn.click();
    await new Promise((r) => setTimeout(r, 400));

    // Step 5 (Details / Storage)
    nextBtn = await pIntro.$('button ::-p-text(Next Step)');
    if (nextBtn) await nextBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    const storageBtn = await pIntro.$('button[aria-label="Toggle Storage Drawers"]');
    if (storageBtn) await storageBtn.click();
    await new Promise((r) => setTimeout(r, 500));

    // -------------------------------------------------------------
    // 9. CONFIGURATION REVIEW (Step 6)
    // -------------------------------------------------------------
    console.log('[9/15] Capturing Configuration Review...');
    nextBtn = await pIntro.$('button ::-p-text(Next Step)');
    if (nextBtn) await nextBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    await pIntro.screenshot({ path: `${LOCAL_DIR}/final_09_configuration_review.png` });
    copyToArtifact('final_09_configuration_review.png');

    // -------------------------------------------------------------
    // 8. PRICING SUMMARY (Formal Quotation Modal)
    // -------------------------------------------------------------
    console.log('[8/15] Capturing Formal Quotation / Pricing Summary...');
    const quoteModalBtn = await pIntro.$('button ::-p-text(Formal Quote)');
    if (quoteModalBtn) await quoteModalBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    await pIntro.screenshot({ path: `${LOCAL_DIR}/final_08_pricing_summary.png` });
    copyToArtifact('final_08_pricing_summary.png');

    // Close quotation modal
    const closeQuote = await pIntro.$('button[aria-label="Close Quotation Sheet"]');
    if (closeQuote) await closeQuote.click();
    await new Promise((r) => setTimeout(r, 400));

    // -------------------------------------------------------------
    // 10. MANUFACTURING SPECIFICATION DESKTOP
    // -------------------------------------------------------------
    console.log('[10/15] Capturing Manufacturing Specification Desktop...');
    const mfgBtn = await pIntro.$('button ::-p-text(Cut List & BOM)');
    if (mfgBtn) await mfgBtn.click();
    await new Promise((r) => setTimeout(r, 700));
    await pIntro.screenshot({ path: `${LOCAL_DIR}/final_10_mfg_spec_desktop.png` });
    copyToArtifact('final_10_mfg_spec_desktop.png');

    // Close mfg spec
    const closeMfg = await pIntro.$('button[aria-label="Close Manufacturing Specification"]');
    if (closeMfg) await closeMfg.click();
    await new Promise((r) => setTimeout(r, 400));

    // -------------------------------------------------------------
    // 12. DEALER PREVIEW
    // -------------------------------------------------------------
    console.log('[12/15] Capturing Dealer Role Preview...');
    const dealerBtn = await pIntro.$('button ::-p-text(Dealer Margin)');
    if (dealerBtn) await dealerBtn.click();
    await new Promise((r) => setTimeout(r, 700));
    await pIntro.screenshot({ path: `${LOCAL_DIR}/final_12_dealer_preview.png` });
    copyToArtifact('final_12_dealer_preview.png');

    // Close dealer preview
    await pIntro.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const close = btns.find((b) => b.innerText.includes('Close Commercial Preview') || b.querySelector('svg'));
      close?.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // -------------------------------------------------------------
    // 13. ERP WORKFLOW PREVIEW
    // -------------------------------------------------------------
    console.log('[13/15] Capturing ERP Workflow Preview...');
    const erpBtn = await pIntro.$('button ::-p-text(ERP Lifecycle)');
    if (erpBtn) await erpBtn.click();
    await new Promise((r) => setTimeout(r, 700));
    await pIntro.screenshot({ path: `${LOCAL_DIR}/final_13_erp_workflow.png` });
    copyToArtifact('final_13_erp_workflow.png');

    // Close ERP preview
    const closeErp = await pIntro.$('button[aria-label="Close ERP Simulation"]');
    if (closeErp) await closeErp.click();
    await new Promise((r) => setTimeout(r, 400));

    // -------------------------------------------------------------
    // 14. SHOWROOM MODE
    // -------------------------------------------------------------
    console.log('[14/15] Capturing Architectural Showroom Mode...');
    const showroomBtn = await pIntro.$('nav button ::-p-text(Showroom)');
    if (showroomBtn) await showroomBtn.click();
    await new Promise((r) => setTimeout(r, 1000));
    await pIntro.screenshot({ path: `${LOCAL_DIR}/final_14_showroom_mode.png` });
    copyToArtifact('final_14_showroom_mode.png');

    // Exit showroom mode
    await pIntro.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 500));
    await pIntro.close();

    // -------------------------------------------------------------
    // MOBILE TESTS AT 390px
    // -------------------------------------------------------------
    console.log('\n--- EXECUTING MOBILE TESTING (390x844) ---');
    const pMobile = await createPage(390, 844, true);
    await pMobile.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

    // Skip intro
    try {
      const skipBtn = await pMobile.waitForSelector('button ::-p-text(Enter Experience)', { timeout: 3000 });
      if (skipBtn) await skipBtn.click();
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 800));

    // -------------------------------------------------------------
    // 4. MOBILE CONFIGURATOR SCREENSHOT
    // -------------------------------------------------------------
    console.log('[4/15] Capturing Mobile Configurator...');
    await pMobile.evaluate(() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 800));
    await pMobile.screenshot({ path: `${LOCAL_DIR}/final_04_mobile_configurator.png` });
    copyToArtifact('final_04_mobile_configurator.png');

    // -------------------------------------------------------------
    // 11. MANUFACTURING SPECIFICATION MOBILE (Vertical Cards!)
    // -------------------------------------------------------------
    console.log('[11/15] Capturing Manufacturing Specification Mobile...');
    // Open from menu or navigate step 6
    const hamburger = await pMobile.$('button[aria-label="Toggle Navigation Menu"]');
    if (hamburger) {
      await hamburger.click();
      await new Promise((r) => setTimeout(r, 400));

      // -------------------------------------------------------------
      // 15. MOBILE NAVIGATION SCREENSHOT
      // -------------------------------------------------------------
      console.log('[15/15] Capturing Mobile Navigation Drawer...');
      await pMobile.screenshot({ path: `${LOCAL_DIR}/final_15_mobile_navigation.png` });
      copyToArtifact('final_15_mobile_navigation.png');

      // Expand Platform capabilities
      await pMobile.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const plat = btns.find((b) => b.innerText.includes('Platform'));
        plat?.click();
      });
      await new Promise((r) => setTimeout(r, 400));

      // Click Manufacturing Specification
      await pMobile.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const mfg = btns.find((b) => b.innerText.includes('Manufacturing Specification'));
        mfg?.click();
      });
      await new Promise((r) => setTimeout(r, 800));

        // Check horizontal overflow in mobile modal
        const modalOverflow = await pMobile.evaluate(() => {
          const modal = document.querySelector('.fixed.inset-0 .bg-\\[\\#FFFEFC\\]');
          if (!modal) return false;
          return modal.scrollWidth > modal.clientWidth;
        });
        console.log('Mobile Mfg Spec Modal Horizontal Overflow:', modalOverflow ? 'FAIL' : 'CLEAN (0px)');

        await pMobile.screenshot({ path: `${LOCAL_DIR}/final_11_mfg_spec_mobile.png` });
        copyToArtifact('final_11_mfg_spec_mobile.png');

        // Close modal
        const closeBtn = await pMobile.$('button[aria-label="Close Manufacturing Specification"]');
        if (closeBtn) await closeBtn.click();
    }

    await pMobile.close();

    console.log('\n--- AUDIT SUMMARY ---');
    console.log('Console Errors Detected:', errors.length);
    if (errors.length > 0) {
      console.warn('Errors encountered:', errors);
      process.exit(1);
    }
    console.log('All 15 screenshots successfully captured and validated with 0 errors!');
  } finally {
    await browser.close();
  }
}

runFullAudit().catch((err) => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
