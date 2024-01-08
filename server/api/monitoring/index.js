// /api/monitoring/index.js
const express = require('express');
const router = express.Router();

const status = require('./status');

router.use(status);

module.exports = router;
