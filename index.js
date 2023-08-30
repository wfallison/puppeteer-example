'use strict';

const puppeteer = require('puppeteer');
const pvaCustomOpts = require('./custom/options');
const url = process.argv[2];

(async () => {
  console.log(pvaCustomOpts)
  if (!url) {
    throw new Error('Absolute URI, including scheme, is required as command line argument')
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const now = new Date();
  const fileName = `reports-out/${now.getTime()}-report-out.pdf`
  await page.goto(url);
  await page.pdf({
    path: fileName,
    displayHeaderFooter: true,
    footerTemplate: '<div style="font-size:12px; margin-left:12px;">Page <span class="pageNumber"</span></div>',
    headerTemplate: '<div></div>',
    format : 'A4',
    margin: {top: '100px', bottom:'100px'}
  });
  await browser.close();
  await makeTableOfContents(fileName);
})();

const makeTableOfContents = async (fileName) => {
  const fs = require('fs');
  const pdf = require('pdf-parse');
  const { Readable } = require("stream");
  let dataBuffer = fs.readFileSync(fileName);
  pdf(dataBuffer).then(function(data) {
      let toc ={}, page;
      //const pagePattern = /Page [0-9]+\/[0-9]+/;
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