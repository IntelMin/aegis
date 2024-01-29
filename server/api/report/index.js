const express = require('express');
const router = express.Router();

const request = require('./request');
const download = require('./download');

router.use(request);
router.use(download);

module.exports = router;
