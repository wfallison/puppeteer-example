'use strict';

const puppeteer = require('puppeteer');
const pvaCustomOpts = require('./custom/options');
const fs = require('fs');
const pdf = require('pdf-parse');
const url = process.argv[2];
const { PDFDocument } = require('pdf-lib');
const PDFMerger = require("pdf-merger-js");

var merger = new PDFMerger();

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

  await page.pdf({
    path: fileName,
    displayHeaderFooter: false,
    headerTemplate: "<div></div>",
    format: "A4",
    printBackground: true,
    timeout: 0,
    path: "page1.pdf",
    pageRanges: "1",
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  await page.pdf({
    path: fileName,
    displayHeaderFooter: true,
    footerTemplate:
      '<div style="font-size:8px; margin-left:12px;">Page <span class="pageNumber"</span></div> <div style="font-size:8px; margin-left: 41.5%"><a href="https://pva.ai" target="_blank">pva.ai</a></div>',
    headerTemplate: "<div></div>",
    format: "A4",
    margin: { top: "50px", bottom: "50px" },
    printBackground: true,
    timeout: 0,
  });
  await page.coverage.stopCSSCoverage();
  await browser.close();

  // Load the generated PDF using pdf-lib
  const pdfDoc = await PDFDocument.load(fs.readFileSync(fileName));

  // Remove the final page (assuming you want to remove the last page)
  const pageCount = pdfDoc.getPageCount();
  if (pageCount > 0) {
    pdfDoc.removePage(pageCount - 1);
  }

  // Save the modified PDF
  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(fileName, modifiedPdfBytes);

  try {
    await merger.add("page1.pdf");
    await merger.add(fileName, `2-${pageCount - 2}`);
    await merger.save("merger.pdf");
  } catch (error) {
    console.log(error);
    console.log("Error occured while combining PDF");
  }

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