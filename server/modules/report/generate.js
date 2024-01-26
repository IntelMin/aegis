const puppeteer = require('puppeteer');
const ejs = require('ejs');
const fs = require('fs');

path = require('path');
const { loadData, getTemplates, renderTemplate } = require('./shared');

async function generatePDF(address, name) {
  // get data
  const contract_dir = path.join(__dirname, `../../cache/contracts/${address}`);
  const data = await loadData(contract_dir);

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
  const combinedContent = await renderTemplate('render.ejs', renderedTemplates);
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setContent(combinedContent);

  await page.addStyleTag({ path: path.join(__dirname, 'assets', 'style.css') });
  // Generate the PDF
  const dir = `./cache/reports/${address}/`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  await page.pdf({
    path: `./cache/reports/${address}/${name}.pdf`,

    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
}

module.exports = generatePDF;
