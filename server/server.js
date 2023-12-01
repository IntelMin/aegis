const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const infoRoute = require("./api/info");
const describeRoute = require("./api/describe");
const markdownRoute = require("./api/markdown");
const dependencyRoute = require("./api/dependencies");
const dashboardRoute = require("./api/dashboard");
const trendingTokens = require("./api/trending");
const deployerRoute = require("./api/deployer");
const auditRoute = require("./api/audit");
const requestRoute = require("./api/requests");

const port = 9898;

// const graphRoute = require('./routes/graph');

app.use(express.json());
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/request", requestRoute);
app.use("/info", infoRoute);
app.use("/describe", describeRoute);
app.use("/markdown", markdownRoute);
app.use("/dependency", dependencyRoute);
app.use("/dashboard", dashboardRoute);
app.use("/trending", trendingTokens);
app.use("/deployer", deployerRoute);
app.use("/audit", auditRoute);
// app.use('/graph', graphRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
