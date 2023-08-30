# puppeteer-example
puppeteer-example

# Getting Started
- Use node v > 16 (At time of writing, 18.9.1 is used)
- Install Dependencies
- Run `node index.js <your-URI>` to produce pdf file
- Check `reports-out` for your file

# Documentation
- Uses the puppeteer `Page.pdf()` method
  - [Docs](https://pptr.dev/api/puppeteer.page.pdf)
  - [Puppeteer PDF Options](https://pptr.dev/api/puppeteer.pdfoptions)

# Applying styles to HTML for printing to PDF
- Applying breakpoints for manual page-breaking
  - [CSS Page Breaks](https://css-tricks.com/almanac/properties/p/page-break/)
- Use `@media print` media queries to define the CSS for `print`
  - Example CSS:
    ```css
      <style type = "text/css">
          @media screen {
            p.bodyText {font-family:verdana, arial, sans-serif;}
          }

          @media print {
            p.bodyText {font-family:georgia, times, serif;}
          }

          @media screen, print {
            p.bodyText {font-size:10pt}
          }
    </style>
    ```

test