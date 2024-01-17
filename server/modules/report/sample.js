const puppeteer = require('puppeteer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const { loadData, getTemplates, renderTemplate } = require('./shared');

async function generatePDF(address, name) {
  // get data
  const contract_dir = path.join(__dirname, `../../cache/contracts/${address}`);
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
  const final = await renderTemplate('render.ejs', renderedTemplates, {
    async: true,
  });

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // combine templates into render.ejs
  const combinedContent = await renderTemplate('render.ejs', renderedTemplates);

  await page.setContent(combinedContent);

  await page.addStyleTag({ path: path.join(__dirname, 'assets', 'style.css') });
  // Generate the PDF
  const pdfpath = path.join(__dirname, `./pdf/${name}.pdf`);
  await page.pdf({
    path: pdfpath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();
}
generatePDF('0xB53b9E28B98C47e87Acfd5A85eeB44a0940EcB12', 'ORB');
// module.exports = generatePDF;
