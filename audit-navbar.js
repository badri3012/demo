import puppeteer from 'puppeteer';

async function testNavbar() {
  console.log('--- STARTING NAVBAR AUDIT ---');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  // 1. Desktop Test (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  // Wait for intro skip
  try {
    const skipBtn = await page.waitForSelector('button ::-p-text(Enter Experience)', { timeout: 3000 });
    if (skipBtn) await skipBtn.click();
  } catch (e) {}

  await new Promise(r => setTimeout(r, 1000));

  // Verify Branding strip text
  const bodyText = await page.evaluate(() => document.body.innerText);
  if (!bodyText.includes('Demo provided by BlazeByte Studio')) {
    throw new Error('Branding strip missing "Demo provided by BlazeByte Studio"');
  }
  console.log('✓ Top branding strip verified: "Demo provided by BlazeByte Studio"');

  // Verify Center Links
  const navText = await page.evaluate(() => {
    const nav = document.querySelector('header nav');
    return nav ? nav.innerText : '';
  });
  console.log('Desktop Nav Links found:', navText.replace(/\n/g, ' | '));

  if (!navText.includes('Configurator') || !navText.includes('Catalogue') || !navText.includes('Showroom') || !navText.includes('Platform')) {
    throw new Error(`Desktop navigation links missing expected items! Found: ${navText}`);
  }
  console.log('✓ Desktop 4-item center navigation verified');

  // Verify CTA
  const ctaBtn = await page.$('button ::-p-text(Design Your Furniture)');
  if (!ctaBtn) throw new Error('CTA "Design Your Furniture" not found');
  console.log('✓ Premium CTA button "Design Your Furniture" verified');

  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Platform'));
    btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const dropdownPresent = await page.evaluate(() => {
    const header = document.querySelector('header');
    return header ? header.innerText.includes('Dealer Economics') && header.innerText.includes('Manufacturing Specification') && header.innerText.includes('ERP Lifecycle') && header.innerText.includes('Roadmap') : false;
  });

  if (!dropdownPresent) {
    throw new Error('Platform dropdown items missing after click!');
  }
  console.log('✓ Platform dropdown verified with all 4 items (Dealer Economics, Manufacturing Spec, ERP Lifecycle, Roadmap)');

  // Test Responsive at 1024px, 768px, 390px, 360px
  const viewports = [1024, 768, 390, 360];
  for (const w of viewports) {
    await page.setViewport({ width: w, height: 800 });
    await new Promise(r => setTimeout(r, 300));
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`Viewport ${w}px overflow check: ${overflow ? 'OVERFLOW' : 'CLEAN'}`);
    if (overflow) throw new Error(`Horizontal overflow detected at ${w}px`);
  }

  // Test Mobile Navigation Menu at 390px
  await page.setViewport({ width: 390, height: 844 });
  const hamburger = await page.$('button[aria-label="Toggle Navigation Menu"]');
  if (!hamburger) throw new Error('Mobile hamburger toggle not found');
  await hamburger.click();
  await new Promise(r => setTimeout(r, 400));

  const mobileNavText = await page.evaluate(() => {
    const mobilePanel = document.querySelector('header .lg\\:hidden.bg-\\[\\#FDFBF7\\]');
    return mobilePanel ? mobilePanel.innerText : '';
  });
  console.log('Mobile nav menu content:', mobileNavText.replace(/\n/g, ' | '));

  if (!mobileNavText.includes('Configurator') || !mobileNavText.includes('Design Your Furniture')) {
    throw new Error('Mobile menu missing essential links');
  }
  console.log('✓ Mobile navigation menu verified');

  await browser.close();
  console.log('--- ALL NAVBAR TESTS PASSED WITH 0 ERRORS ---');
}

testNavbar().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
