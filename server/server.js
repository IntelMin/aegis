const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')

const port = 9898;

const infoRoute = require('./api/info');
const describeRoute = require('./api/describe');
const markdownRoute = require('./api/markdown');
const deployerRoute = require('./api/deployer');
const dependencyRoute = require('./api/dependencies');
const codeRoute = require('./api/code');
const dashboardRoute = require('./api/dashboard');

const trendingTokens = require('./api/trending');
// const graphRoute = require('./routes/graph');

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/info', infoRoute);
app.use('/describe', describeRoute);
app.use('/markdown', markdownRoute);
app.use('/deployer', deployerRoute);
app.use('/dependency', dependencyRoute);
app.use('/code', codeRoute);
app.use('/dashboard', dashboardRoute);

app.use('/trending', trendingTokens);
// app.use('/graph', graphRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
