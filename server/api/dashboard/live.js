const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const axios = require('axios');
const { fetchData, readCache, writeCache } = require('../../lib/utils');

async function getLivePairs() {
  console.log('Getting live pairs');
  try {
    const { data } = await axios.post(
      'https://graph.defined.fi/graphql',
      {
        query: `
        query {
            getLatestPairs(
              networkFilter: [1]
              limit: 40
            ) {
              cursor
              items {
                address
                exchangeHash
                id
                initialPriceUsd
                liquidAt
                liquidity
                liquidityToken
                networkId
                newToken
                nonLiquidityToken
                oldToken
                priceChange
                priceUsd
                transactionHash
                token0 {
                  address
                  currentPoolAmount
                  decimals
                  id
                  initialPoolAmount
                  name
                  networkId
                  pairId
                  poolVariation
                  symbol
                }
                token1 {
                  address
                  currentPoolAmount
                  decimals
                  id
                  initialPoolAmount
                  name
                  networkId
                  pairId
                  poolVariation
                  symbol
                }
              }
            }
          }`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.DEFINED_FI_API_KEY,
        },
      }
    );

    if (data.errors) {
      console.error('Error fetching data:', data.errors);
      return [];
    } else {
      // console.log(data.data.listTopTokens);
      let filename = `./cache/trending/live.json`;
      await writeCache(filename, data.data.getLatestPairs.items);
    }
  } catch (e) {
    console.log(e);
  }
}

router.get('/live', async (req, res) => {
  let filename = `./cache/trending/live.json`;
  let filedata = await readCache(filename);
  res.status(200).send(filedata);
});

async function init() {
  await getLivePairs();

  console.log(`Dashboard: live fetch cron to run every minute`);
  cron.schedule('*/1 * * * *', () => {
    getLivePairs();
  });
}

module.exports = { router, init };
