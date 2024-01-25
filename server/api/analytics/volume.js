const express = require('express');
const router = express.Router();
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
    res.status(404).send({});

    console.error('Error getting logs:', error);
  }
});

module.exports = router;
