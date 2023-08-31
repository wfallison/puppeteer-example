'use strict';

const puppeteer = require('puppeteer');
const pvaCustomOpts = require('./custom/options');
const fs = require('fs');
const pdf = require('pdf-parse');
const url = process.argv[2];

(async () => {
  console.log(pvaCustomOpts);
  if (!url) {
    throw new Error(
      "Absolute URI, including scheme, is required as command line argument"
    );
  }
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  const now = new Date();
  const fileName = `reports-out/${now.getTime()}-report-out.pdf`;
  await page.coverage.startCSSCoverage();
  await page.goto(url);
  await page.addStyleTag({ path: "all.css" });
  await page.addStyleTag({ path: "override.css" });
  // await page.addStyleTag({
  //   content: `
  //       body { margin-top: 1cm; }
  //       @page:first { margin-top: 0; }
  //   `,
  // });
  await page.pdf({
    path: fileName,
    displayHeaderFooter: true,
    footerTemplate:
      '<div style="font-size:8px; margin-left:12px;">Page <span class="pageNumber"</span></div>',
    headerTemplate: "<div></div>",
    format: "A4",
    margin: { top: "50px", bottom: "50px" },
    printBackground: true,
    timeout: 0,
  });
  await page.coverage.stopCSSCoverage();
  await browser.close();
  await makeTableOfContents(fileName);
})();

const makeTableOfContents = async (fileName) => {

  let dataBuffer = fs.readFileSync(fileName);
  pdf(dataBuffer).then(function(data) {
      let toc ={}, page;
      const pagePattern = /Page [0-9][0-9]/;
      const topicPattern = /Title: [A-Za-z 0-9]+/;
      const lines = data.text.split('\n');
      lines.forEach((chunk, i, lines) => {
          if(chunk.match(pagePattern)) {
              page = chunk
          }
          if(chunk.match(topicPattern) && !toc[chunk]) {
              toc[chunk] = page
          }
      });
      console.log(page)
      console.log(toc); // Use this object to fill in values for your table of content
  });
}