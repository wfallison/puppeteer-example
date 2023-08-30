const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const now = new Date();
  await page.goto('http://localhost:3000');
  await page.pdf({
    path: `reports-out/${now.getTime()}-report-out.pdf`,
  });
  await browser.close();
})();
