const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const axios = require('axios');
const { fetchData, readCache, writeCache } = require('../../lib/utils');
const parsec = require('../../lib/third-party/parsec');

router.get('/volume', async (req, res) => {
  const address = req.query.address;
  const resolution = req.query.resolution;

  console.log(`-- volume fetch: ${address} ${resolution}`);

  try {
    const response = await parsec.fetchContractLogsIntervals({
      since: 1705181196,
      log: 'Transfer',
      address: address,
      chain: 'eth',
      logInput: 'value',
      interval: resolution.toLowerCase(),
      operator: 'sum',
    });

    intervals = response.data.contract.logIntervals;

    // console.log(intervals);
    res.status(200).send(intervals);
  } catch (error) {
    console.error('Error getting logs:', error);
  }
});

module.exports = router;
