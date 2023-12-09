const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

async function renderTemplate(filename, data) {
  const templateString = fs.readFileSync(
    path.join(__dirname, "templates", filename),
    "utf-8"
  );
  return ejs.render(templateString, data);
}

function readJSONFile(filePath) {
  const jsonString = fs.readFileSync(path.join(__dirname, filePath), "utf-8");
  return JSON.parse(jsonString);
}

function loadData(directory) {
  const data = {};
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const catagory = file.split(".")[0];
    const filePath = path.join(directory, file);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const fileData = JSON.parse(fileContents);
    if (
      fileData.hasOwnProperty("data") &&
      Object.keys(fileData).length <= 2 &&
      fileData.hasOwnProperty("time")
    ) {
      data[catagory] = fileData.data;
    } else {
      data[catagory] = fileData;
    }
  }

  // date
  const currentDate = new Date();
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  data["extra"] = {
    currentDate: formattedDate,
  };

  return data;
}

function getTemplates() {
  const templates = {};
  let files = fs.readdirSync(path.join(__dirname, "templates"));

  files = files
    .filter((file) => file !== "render.ejs")
    .filter((file) => file !== "generate.ejs")
    .sort((a, b) => {
      const numA = parseInt(a.split("_")[0]);
      const numB = parseInt(b.split("_")[0]);
      return numA - numB;
    });

  for (const file of files) {
    let parts = file.split('_');
    let name = parts[1].split('.')[0];
    const filePath = path.join(__dirname, "templates", file);
    const fileData = fs.readFileSync(filePath, "utf-8");
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
