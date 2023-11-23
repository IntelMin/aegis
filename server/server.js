const express = require('express');
const app = express();
const port = 9898;

const infoRoute = require('./api/info');
const describeRoute = require('./api/describe');
const markdownRoute = require('./api/markdown');
const dependencyRoute = require('./api/dependencies');
const codeRoute = require('./api/code');

const trendingTokens = require('./api/trending');
// const graphRoute = require('./routes/graph');

app.use('/info', infoRoute);
app.use('/describe', describeRoute);
app.use('/markdown', markdownRoute);
app.use('/dependency', dependencyRoute);
app.use('/code', codeRoute);

app.use('/trending', trendingTokens);
// app.use('/graph', graphRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
