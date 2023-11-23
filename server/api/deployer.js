const express = require('express');
const code = require('../constants/code');

const router = express.Router();

router.get('/code', (req, res) => {
  res.status(200).json({ code })
});

module.exports = router;