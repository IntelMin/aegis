const express = require('express');
const router = express.Router();

const volume = require('./volume');
const holders = require('./holders');
const orders = require('./orders');
// const transactions = require('./transactions');
// const wallets = require('./wallets');

router.use(volume);
router.use(holders);
router.use(orders);
// router.use(transactions);
// router.use(wallets);

module.exports = router;
