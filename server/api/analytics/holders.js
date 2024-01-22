const express = require('express');
const router = express.Router();
const parsec = require('../../lib/third-party/parsec');

router.get('/holders', async (req, res) => {
  const address = req.query.address;
  const symbol = req.query.symbol;
  const limit = req.query.limit;

  console.log(`-- holders fetch: ${address} with limit ${limit}`);

  try {
    const response = await parsec.fetchTokenHolders({
      address: address,
      symbol: symbol || '',
      limit: parseInt(limit, 10) || 100,
      chain: 'eth',
    });

    const tokenHolders = response.data.token.topHolders;

    // console.log(tokenHolders);
    res.status(200).send(tokenHolders);
  } catch (error) {
    console.error('Error getting token holders:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
