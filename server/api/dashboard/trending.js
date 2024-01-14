const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const axios = require('axios');
const { fetchData, readCache, writeCache } = require('../../lib/utils');
const { get } = require('http');

// TODI: fix sparkline data
async function addSparklineToTokens(tokens, interval) {
  const sparklinePromises = tokens.map(async token => {
    const sparklineData = await fetchSparkline(interval, token.address);
    return { ...token, sparkline: sparklineData };
  });

  return await Promise.all(sparklinePromises);
}

async function fetchSparkline(interval, token_address) {
  const axios = require('axios');
  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const query = `
      query ($baseAddress: String, $interval: Int) {
          ethereum(network: ethereum) {
          dexTrades(
              baseCurrency: {is: $baseAddress}
              date: {since: "${formatDate(yesterday)}", till: "${formatDate(
    tomorrow
  )}"}
              options: {limit: 500, desc: "timeInterval.minute"}
              quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}
          ) {
              timeInterval {
                  minute(count: $interval)
              }
              high: quotePrice(calculate: maximum)
              low: quotePrice(calculate: minimum)
              open: minimum(of: date, get: quote_price)
              close: maximum(of: date, get: quote_price)
          }
          }
      }
      `;

  const variables = {
    interval: interval * 60,
    baseAddress: token_address,
  };

  let data = JSON.stringify({
    query: query,
    variables: variables,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://graphql.bitquery.io',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': 'BQYQ9TdsIv5QV5c862Mv59GAneSz84WT',
      Authorization:
        'Bearer ory_at_CS4A3FafgB732O_SVGViUK3M4hdD7WtdWgkDRbMPFGA.PYXK0nQJw6RQAgpiVAWbTFG5oiF48Eg8bYMT0xGF2so',
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data.data.ethereum.dexTrades;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getTrending(interval) {
  let resolution = interval * 60;
  console.log('Getting trending token data for resolution:', resolution);
  try {
    const { data } = await axios.post(
      'https://graph.defined.fi/graphql',
      {
        query: `
                      query {
                          listTopTokens(
                              networkFilter: [1]
                              limit: 20
                              resolution: "${resolution}"
                          ) {
                              name
                              symbol
                              address
                              createdAt
                              volume
                              liquidity
                              marketCap
                              imageThumbUrl
                              imageSmallUrl
                              imageLargeUrl
                              price
                              priceChange
                              priceChange1
                              priceChange4
                              priceChange12
                              priceChange24
                              topPairId
                              exchanges {
                                  name
                              }
                          }
                      }
                  `,
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

      const tokensWithSparkline = await addSparklineToTokens(
        data.data.listTopTokens,
        interval
      );

      let filename = `./cache/trending/${interval}.json`;
      await writeCache(filename, tokensWithSparkline);
    }
  } catch (error) {
    console.error(error);
  }
}

router.get('/trending', async (req, res) => {
  const { interval } = req.query;

  console.log('interval', interval);

  let filename = `./cache/trending/${interval}.json`;

  let filedata = await readCache(filename);

  res.status(200).send(filedata);
});

// getTrending(1);
// fetchSparkline(1, '0x6b175474e89094c44da98b954eedeac495271d0f');

function scheduleTrendingFetch(frequency, duration) {
  cron.schedule(frequency, () => {
    // console.log(`Running fetch task for ${duration}hr data`);
    getTrending(duration);
  });
}

// Schedule the top tokens fetch
scheduleTrendingFetch('*/5 * * * *', 1); // Every hour, check every 3 minutes
scheduleTrendingFetch('*/15 * * * *', 4); // Every 4 hours, check every 10 mins
scheduleTrendingFetch('0 * * * *', 12); // Every 12 hours, check every 60 mins
scheduleTrendingFetch('0 */6 * * *', 24); // Every 24 hours (daily), check every 6 hours

async function init() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  await getTrending(1);

  await new Promise(resolve => setTimeout(resolve, 2000));
  await getTrending(4);

  await new Promise(resolve => setTimeout(resolve, 2000));
  await getTrending(12);

  await new Promise(resolve => setTimeout(resolve, 2000));
  await getTrending(24);
}

module.exports = { router, init };
