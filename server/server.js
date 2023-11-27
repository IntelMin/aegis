const express = require("express");
const fs = require('fs');
const http = require("http");
const https = require("https");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const codeRoute = require("./api/code");
const infoRoute = require("./api/info");
const describeRoute = require("./api/describe");
const markdownRoute = require("./api/markdown");
const dependencyRoute = require("./api/dependencies");
const dashboardRoute = require("./api/dashboard");
const trendingTokens = require("./api/trending");
const deployerRoute = require("./api/deployer");

const HTTP_PORT = 9898;
const HTTPS_PORT = 443;
const keyPath = "/etc/letsencrypt/live/srv.aiaegis.org/privkey.pem";
const certPath = "/etc/letsencrypt/live/srv.aiaegis.org/fullchain.pem";

// const graphRoute = require('./routes/graph');

app.use(express.json());
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/info", infoRoute);
app.use("/describe", describeRoute);
app.use("/markdown", markdownRoute);
app.use("/dependency", dependencyRoute);
app.use("/code", codeRoute);
app.use("/dashboard", dashboardRoute);
app.use("/trending", trendingTokens);
app.use("/deployer", deployerRoute);
// app.use('/graph', graphRoute);

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    console.log(`[PROD] HTTPS Server running on port ${HTTPS_PORT}`);
  });
} else {
  app.listen(HTTP_PORT, () => {
    console.log(`[DEV] HTTP Server running on port ${HTTP_PORT}`);
  });
}
