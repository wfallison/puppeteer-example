const puppeteer = require('puppeteer');
const url = process.argv[2];


(async () => {
  if (!url) {
    throw new Error('Absolute URI, including scheme, is required as command line argument')
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const now = new Date();
  await page.goto(url);
  await page.pdf({
    path: `reports-out/${now.getTime()}-report-out.pdf`,
  });
  await browser.close();
})();
