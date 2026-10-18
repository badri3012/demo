import puppeteer from 'puppeteer';

async function testDesktop() {
  console.log('--- TESTING DESKTOP REGRESSION ---');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl']
  });

  const page = await browser.newPage();
  const widths = [1024, 1280, 1440, 1920];

  for (const w of widths) {
    await page.setViewport({ width: w, height: 900 });
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });
    try {
      const skipBtn = await page.waitForSelector('button ::-p-text(Enter Experience)', { timeout: 2000 });
      if (skipBtn) await skipBtn.click();
    } catch(e) {}
    await new Promise(r => setTimeout(r, 600));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log('Desktop ' + w + 'px: Overflow: ' + (overflow ? 'FAIL' : 'CLEAN'));
    if (overflow) throw new Error('Overflow on desktop ' + w + 'px');
  }

  // Capture 1440px screenshot
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => document.getElementById('configurator')?.scrollIntoView());
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'screenshots/audit/desktop_regression_1440.png' });
  console.log('Desktop 1440px screenshot captured');

  await browser.close();
  console.log('--- DESKTOP REGRESSION PASSED WITH 0 DEFECTS ---');
}

testDesktop().catch(err => {
  console.error('Desktop test failed:', err);
  process.exit(1);
});
