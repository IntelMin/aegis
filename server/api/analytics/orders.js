const express = require('express');
const router = express.Router();
const parsec = require('../../lib/third-party/parsec');

router.get('/orders', async (req, res) => {
  const poolAddress = req.query.address.toLowerCase();
  const exchange = req.query.exchange;
  const limit = 50;
  const binWidth = 1 / limit;
  const x3Limit = limit * 3;
  const x3BinWidth = 1 / x3Limit;
  const x10Limit = limit * 10;
  const x10BinWidth = 1 / x10Limit;

  console.log(`-- order-book fetch: ${poolAddress} with limit ${limit}`);

  try {
    const response = await parsec.fetchLiquidityPool({
      poolAddress,
      exchange,
      binWidth,
      limit,
      x3BinWidth,
      x3Limit,
      x10BinWidth,
      x10Limit,
    });

    const liquidityPoolData = response.data.liquidityPool;

    // console.log(liquidityPoolData);
    res.status(200).send(liquidityPoolData);
  } catch (error) {
    console.error('Error getting liquidity pool data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
