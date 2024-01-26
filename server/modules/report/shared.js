const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

async function renderTemplate(filename, data) {
  const templateString = fs.readFileSync(
    path.join(__dirname, 'templates', filename),
    'utf-8'
  );
  return ejs.render(templateString, data);
}

function readJSONFile(filePath) {
  const jsonString = fs.readFileSync(path.join(__dirname, filePath), 'utf-8');
  return JSON.parse(jsonString);
}

function loadData(directory) {
  const data = {};
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const catagory = file.split('.')[0];
    const filePath = path.join(directory, file);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const fileData = JSON.parse(fileContents);
    if (
      fileData?.hasOwnProperty('data') &&
      Object.keys(fileData).length <= 2 &&
      fileData.hasOwnProperty('time')
    ) {
      data[catagory] = fileData.data;
    } else {
      data[catagory] = fileData;
    }
  }

  // date
  const currentDate = new Date();
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  const contractAddress = Object.keys(data.security.result)[0];

  data.security = data.security.result[contractAddress];
  data.source = data.source[0];
  data.source.abi = JSON.parse(data.source.ABI);
  data.source.source_code = data.source.SourceCode;
  data.extra = {
    currentDate: formattedDate,
  };

  return data;
}

function getTemplates() {
  const templates = {};
  let files = fs.readdirSync(path.join(__dirname, 'templates'));

  files = files
    .filter(file => file !== 'render.ejs')
    .filter(file => file !== 'generate.ejs')
    .sort((a, b) => {
      const numA = parseInt(a.split('_')[0]);
      const numB = parseInt(b.split('_')[0]);
      return numA - numB;
    });

  for (const file of files) {
    let parts = file.split('_');
    let name = parts[1].split('.')[0];
    const filePath = path.join(__dirname, 'templates', file);
    let fileData = fs.readFileSync(filePath, 'utf-8');

    // change img src to base64
    fileData = fileData.replace(
      /\b(src=".*?)(\.jpg|\.jpeg|\.png)"/g,
      (match, p1, p2) => {
        const imageFilename = p1.split('/').pop() + p2;
        const imagePath = path.join(__dirname, 'assets', imageFilename);
        if (fs.existsSync(imagePath)) {
          const imageAsBase64 = fs.readFileSync(imagePath, 'base64');
          const mimeType = p2 === '.png' ? 'image/png' : 'image/jpeg';
          return `src="data:${mimeType};base64,${imageAsBase64}"`;
        } else {
          return match;
        }
      }
    );

    templates[name] = fileData;
  }
  return templates;
}

module.exports = {
  renderTemplate,
  readJSONFile,
  loadData,
  getTemplates,
};
