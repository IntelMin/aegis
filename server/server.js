const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
// const infoRoute = require("./api/info");
// const describeRoute = require("./api/describe");
// const markdownRoute = require("./api/markdown");
// const dependencyRoute = require("./api/dependencies");
const dashboardRoute = require("./api/dashboard");
const monitorRoute = require("./api/monitor");
const trendingTokens = require("./api/trending");
const deployerRoute = require("./api/deployer");
const auditRoute = require("./api/audit");
const requestRoute = require("./api/requests");
const reportRoute = require("./api/report");
const bugbountyRoute = require("./api/bugbounty");
const codeRoute = require("./api/code");
const port = 9898;

app.use(express.json());
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const router = express.Router();

router.get('/ping', (req, res) => {
  res.status(200).json({ result: 'pong' });
});

app.use("/request", requestRoute);
app.use("/dashboard", dashboardRoute);
app.use("/monitor", monitorRoute);
app.use("/trending", trendingTokens);
app.use("/deployer", deployerRoute);
app.use("/audit", auditRoute);
app.use("/report",reportRoute)
app.use("/bugbounty",bugbountyRoute)
app.use("/code", codeRoute);
// app.use("/info", infoRoute);
// app.use("/describe", describeRoute);
// app.use("/markdown", markdownRoute);
// app.use("/dependency", dependencyRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
