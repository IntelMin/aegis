const express = require('express');
const router = express.Router();
const { bitqueryRequest } = require('../../utils');

const getData = async (data, type) => {
  const response = await bitqueryRequest(data, type);

  if (response == null) {
    throw new Error('wrong respond');
  }

  return response;
};

router.post('/get-token-price-usdt', async (req, res) => {
  const token = req.body.token;
  const usdtAddress = req.body.usdtAddress;

  if (token && usdtAddress) {
    res.status(200).send(
      await getData(
        {
          query:
            'query getTokenPriceUSDT($token: String!, $usdtAddress: String!) {\n  ethereum {\n    dexTrades(\n      baseCurrency: {is: $token}\n      quoteCurrency: {is: $usdtAddress}\n      options: {desc: ["block.height", "transaction.index"], limit: 1}\n    ) {\n      block {\n        height\n        timestamp {\n          time(format: "%Y-%m-%d %H:%M:%S")\n        }\n      }\n      transaction {\n        index\n      }\n      baseCurrency {\n        symbol\n      }\n      quoteCurrency {\n        symbol\n      }\n      quotePrice\n    }\n  }\n}\n',
          variables: {
            token: token,
            usdtAddress: usdtAddress,
          },
        },
        1
      )
    );
  } else {
    res.status(500).send('Invalid Parameter');
  }
});

router.post('/token-holders-for-usdt', async (req, res) => {
  const count = req.body.count;
  const date = req.body.date;
  const tokenSmartContract = req.body.tokenSmartContract;

  if (count && date && tokenSmartContract) {
    let data = JSON.stringify({
      query:
        '{\n  EVM(dataset: archive, network: eth) {\n    TokenHolders(\n      orderBy: {descending: Balance_Amount}\n      limit: {count: 10}\n      date: "2023-12-22"\n      tokenSmartContract: "0xdac17f958d2ee523a2206206994597c13d831ec7"\n    ) {\n      Holder {\n        Address\n      }\n      Balance {\n        Amount\n      }\n    }\n  }\n}\n',
      variables: '{}',
    });

    res.status(200).send(await getData(data, 2));
  } else {
    res.status(500).send('Invalid Parameter');
  }
});

router.get('/hoders', async (req, res) => {});

router.get('/token-trades', async (req, res) => {});

router.get('/binance-token-trade', async (req, res) => {
  const token = req.body.token;
  const from = req.body.from;
  const till = req.body.till;
  const token1 = req.body.token1;

  if (token && token1 && from && till) {
  } else {
    res.status(500).send('Invalid Parameter');
  }
});

module.exports = router;
