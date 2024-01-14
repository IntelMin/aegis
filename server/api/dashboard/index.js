const express = require('express');
const router = express.Router();

const { router: liveRoute, init: initLive } = require('./live');
const { router: trendingRoute, init: initTrending } = require('./trending');

router.use(liveRoute);
router.use(trendingRoute);

module.exports = { initLive, initTrending, router };
