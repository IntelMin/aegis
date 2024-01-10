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
      query: `{\n  EVM(dataset: archive, network: eth) {\n    TokenHolders(\n      orderBy: {descending: Balance_Amount}\n      limit: {count: "${count}"}\n      date: "${date}"\n      tokenSmartContract: "${tokenSmartContract}"\n    ) {\n      Holder {\n        Address\n      }\n      Balance {\n        Amount\n      }\n    }\n  }\n}\n`,
      variables: '{}',
    });

    res.status(200).send(await getData(data, 2));
  } else {
    res.status(500).send('Invalid Parameter');
  }
});

router.post('/trades', async (req, res) => {
  const baseCurrency = req.body.baseCurrency;
  if (baseCurrency) {
    let data = JSON.stringify({
      query: `{\n  ethereum(network: ethereum) {\n    dexTrades(\n      options: {desc: ["block.height", "tradeIndex"], limit: 100}\n      baseCurrency: {is: "${baseCurrency}"}\n    ) {\n      quotePrice\n      block {\n        timestamp {\n          time(format: "%Y-%m-%d %H:%M:%S")\n        }\n        height\n      }\n      tradeIndex\n      protocol\n      exchange {\n        fullName\n      }\n      smartContract {\n        address {\n          address\n          annotation\n        }\n      }\n      baseAmount\n      baseCurrency {\n        address\n        symbol\n      }\n      quoteAmount\n      quoteCurrency {\n        address\n        symbol\n      }\n      transaction {\n        hash\n      }\n    }\n  }\n}`,
      variables: '{}',
    });

    res.status(200).send(await getData(data, 1));
  } else {
    res.status(500).send('Invalid Parameter');
  }
});

router.post('/volume', async (req, res) => {
  const exchangeAddress = req.body.exchangeAddress;
  const baseCurrency = req.body.baseCurrency;
  const quoteCurrency = req.body.quoteCurrency;

  if (exchangeAddress && baseCurrency && quoteCurrency) {
    let data = JSON.stringify({
      query: `{\n  ethereum(network: bsc) {\n    dexTrades(\n      options: { limit: 48, desc: "timeInterval.minute" }\n      exchangeAddress: { is: "${exchangeAddress}" }\n      baseCurrency: { is: "${baseCurrency}" }\n      quoteCurrency: { is: "${quoteCurrency}" }\n    ) {\n      timeInterval {\n        minute(count: 30)\n      }\n      baseCurrency {\n        symbol\n        address\n      }\n      quoteCurrency {\n        symbol\n        address\n      }\n      trades: count\n      tradeAmount(in: USD)\n      volume: quoteAmount\n      quotePrice\n      maximum_price: quotePrice(calculate: maximum)\n      minimum_price: quotePrice(calculate: minimum)\n      open_price: minimum(of: block, get: quote_price)\n      close_price: maximum(of: block, get: quote_price)\n    }\n  }\n}\n`,
      variables: '{}',
    });

    res.status(200).send(await getData(data, 1));
  } else {
    res.status(500).send('Invalid Parameter');
  }
});

router.post('/transactions', async (req, res) => {
  const limit = req.body.limit;
  const network = req.body.network;
  const from = req.body.from;
  const till = req.body.till;
  const address = req.body.address;

  if (limit && network && from && till && address) {
    let data = JSON.stringify({
      query:
        'query ($network: evm_network, $limit: Int, $address: String!, $from: String, $till: String) {\n  EVM(dataset: combined, network: $network) {\n    Transactions(\n      where: {Transaction: {From: {is: $address}}, Block: {Date: {since: $from, till: $till}}}\n      orderBy: {descending: Block_Time}\n      limit: {count: $limit}\n    ) {\n      count\n      ChainId\n      Block {\n        Time\n        Number\n      }\n      gas_cost: sum(of: Fee_SenderFee)\n      Transaction {\n        Hash\n        To\n      }\n      TransactionStatus {\n        Success\n      }\n    }\n  }\n}\n',
      variables: {
        limit: limit,
        network: network,
        from: from,
        till: till,
        address: address,
      },
    });

    res.status(200).send(await getData(data, 2));
  } else {
    res.status(500).send('Invalid Parameter');
  }
});

module.exports = router;
