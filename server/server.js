require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const auditRoute = require('./api/audit');
const tokenRoute = require('./api/token');
const searchRoute = require('./api/search');
const reportRoute = require('./api/report');
const infoRoute = require('./api/info');
const analyticsRoute = require('./api/analytics');
const {
  router: dashboardRoute,
  initLive: initDashboardLive,
  initTrending: initDashboardTrending,
} = require('./api/dashboard');
const { router: bountyRoute, init: initBounty } = require('./api/bounty');
const { router: attacksRoute, init: initAttacks } = require('./api/attacks');

// const monitorRoute = require('./api/monitor');
// const monitoringRoute = require('./api/monitoring');
// const bugbountyRoute = require('./api/bugbounty');
// const describeRoute = require("./api/describe");
// const markdownRoute = require("./api/markdown");
// const dependencyRoute = require("./api/dependencies");
// const trendingTokens = require('./api/trending');
// const deployerRoute = require('./api/deployer');
// const codeRoute = require('./api/audit/code');

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

app.use('/dashboard', dashboardRoute);
app.use('/audit', auditRoute);
app.use('/token', tokenRoute);
app.use('/search', searchRoute);
app.use('/info', infoRoute);
app.use('/report', reportRoute);
app.use('/bounty', bountyRoute);
app.use('/attacks', attacksRoute);
app.use('/analytics', analyticsRoute);

// app.use('/monitor', monitorRoute);
// app.use('/monitoring', monitoringRoute);
// app.use('/deployer', deployerRoute);
// app.use('/code', codeRoute);
// app.use('/trending', trendingTokens);
// app.use("/describe", describeRoute);
// app.use("/markdown", markdownRoute);
// app.use("/dependency", dependencyRoute);

async function init() {
  try {
    console.log('Initializing...');

    await Promise.all([
      initDashboardLive(),
      initDashboardTrending(),
      initBounty(),
      initAttacks(),
    ]);

    console.log('Initialization complete.');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize:', error);
    process.exit(1);
  }
}

init();
