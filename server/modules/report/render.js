const express = require("express");
const app = express();
const port = 3434;
const path = require("path");
const ejs = require("ejs");
const { loadData, getTemplates, renderTemplate } = require("./shared");

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", async (req, res) => {
  try {
    // get data
    const data = loadData("../../cache/contracts/0x9813037ee2218799597d83d4a5b6f3b6778218d9");

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
    const final = await renderTemplate("render.ejs", renderedTemplates,{async: true});

    // return final output
    res.status(200).send(final);
    
  } catch (error) {
    console.log(error);
    // console.log("error");
    return res.status(500).send(error);
  }

});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
