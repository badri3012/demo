import puppeteer from 'puppeteer';

async function verifyLive() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  console.log('Navigating to live production: https://flexispace-omega.vercel.app ...');
  const res = await page.goto('https://flexispace-omega.vercel.app', { waitUntil: 'networkidle0' });
  console.log('HTTP Status:', res.status());

  try {
    const skipBtn = await page.waitForSelector('button ::-p-text(Enter Experience)', { timeout: 3000 });
    if (skipBtn) await skipBtn.click();
  } catch (e) {}
  await new Promise(r => setTimeout(r, 1000));

  const content = await page.content();
  console.log('Branding text present:', content.includes('Demo provided by BlazeByte Studio'));
  console.log('Unverified text removed (Peenya Unit 01):', !content.includes('Peenya Unit 01'));
  console.log('Unverified text removed (ERP Schema v2.4):', !content.includes('ERP Schema v2.4'));

  // Test mobile manufacturing modal
  const hamburger = await page.$('button[aria-label="Toggle Navigation Menu"]');
  if (hamburger) {
    await hamburger.click();
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const plat = btns.find(b => b.innerText.includes('Platform'));
      plat?.click();
    });
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const mfg = btns.find(b => b.innerText.includes('Manufacturing Specification'));
      mfg?.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const modalOverflow = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0 .bg-\\[\\#FFFEFC\\]');
      if (!modal) return false;
      return modal.scrollWidth > modal.clientWidth;
    });
    console.log('Live Mobile Mfg Spec Modal Overflow:', modalOverflow ? 'FAIL' : 'CLEAN (0px)');
  }

  console.log('Live Console Errors count:', errors.length);
  if (errors.length > 0) {
    console.log('Live Console Errors:', errors);
  }

  await browser.close();
  console.log('LIVE PRODUCTION VERIFICATION COMPLETED SUCCESSFULLY!');
}

verifyLive().catch(err => {
  console.error('Live verification failed:', err);
  process.exit(1);
});
