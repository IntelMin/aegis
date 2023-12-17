const puppeteer = require("puppeteer");
const ejs = require("ejs");
const fs = require("fs");

path = require("path");
const { loadData, getTemplates, renderTemplate } = require("./shared");

 async function generatePDF(address) {

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // get data
  const contract_dir = path.join(__dirname, `../../cache/contracts/${address}`)
  const data = loadData(contract_dir);

  // get templates
  const templates = getTemplates();
  const renderedTemplates = {};

  // load data into templates
  for (const file in templates) {
    const template = templates[file];
    const renderedTemplate = ejs.render(template, data);
    renderedTemplates[file] = renderedTemplate;
  }

  // combine templates into render.ejs
  const combinedContent = await renderTemplate("render.ejs",renderedTemplates);
  await page.setContent(combinedContent);

  await page.addStyleTag({ path: path.join(__dirname, "assets", "style.css") });
  // Generate the PDF
  await page.pdf({

    path: `./modules/report/pdf/${address}.pdf`,

    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
}


module.exports = generatePDF;



