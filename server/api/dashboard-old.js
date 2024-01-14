const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const cron = require('node-cron');
const axios = require('axios');
const { fetchData, readCache, writeCache } = require('../lib/utils');
const { get } = require('http');

// require('dotenv').config({ path: './../.env.local' });
const statsCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

const calculateStats = () => {
  console.log('Calculating stats');
  let stats = {
    audits: 0,
    findings: 0,
    LOC: 0,
    functions: 0,
    liquidity: 0,
  };

  const directories = fs.readdirSync(path.join(__dirname, '../data'));

  stats.audits = directories.length;

  directories.forEach(dir => {
    const findingsPath = path.join(
      __dirname,
      `/../cache/contracts/${dir}/findings.json`
    );
    const treePath = path.join(
      __dirname,
      `/../cache/contracts/${dir}/tree.json`
    );
    const securityPath = path.join(
      __dirname,
      `/../cache/contracts/${dir}/security.json`
    );
    console.log(findingsPath);
    if (fs.existsSync(findingsPath)) {
      const findings = JSON.parse(fs.readFileSync(findingsPath, 'utf8'));
      stats.findings += findings.length;
    }

    if (fs.existsSync(treePath)) {
      const tree = JSON.parse(fs.readFileSync(treePath, 'utf8'));
      tree.map(file => {
        stats.LOC += file.line;
        stats.functions += file.functions.length;
      });
    }

    if (fs.existsSync(securityPath)) {
      const security = JSON.parse(fs.readFileSync(securityPath, 'utf8'));
      stats.liquidity += security.liquidity;
    }
  });

  statsCache.set('stats', stats);
};

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
}

async function getLivePairs() {
  console.log('Getting live pairs');
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
}

router.get('/', (req, res) => {
  console.log('here');
  const stats = statsCache.get('stats');

  if (stats === undefined) {
    calculateStats();
    res.json(statsCache.get('stats'));
  } else {
    res.json(stats);
  }
});

router.get('/collections', (req, res) => {
  axios
    .post(
      'https://graph.defined.fi/graphql',
      {
        query: `{
                    getNetworks {
                    name
                    id
                    }
                }`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.DEFINED_FI_API_KEY,
        },
      }
    )
    .then(response => {
      res.json(response.data);
    });
});

router.get('/top-tokens', (req, res) => {
  const { chain_id, limit, resolution } = req.query;
  axios
    .post(
      'https://graph.defined.fi/graphql',
      {
        query: `
                    query {
                        listTopTokens(
                            networkFilter: [${chain_id}]
                            limit: ${limit}
                            resolution: ${resolution}
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
    )
    .then(response => {
      res.json(response.data.data.listTopTokens);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
    });
});

router.get('/trending', async (req, res) => {
  const { interval } = req.query;

  console.log('interval', interval);

  let filename = `./cache/trending/${interval}.json`;

  let filedata = await readCache(filename);

  res.status(200).send(filedata);
});

router.get('/live', async (req, res) => {
  let filename = `./cache/trending/live.json`;
  let filedata = await readCache(filename);
  res.status(200).send(filedata);
});

cron.schedule('0 * * * *', calculateStats);
cron.schedule('*/1 * * * *', getLivePairs);

// getTrending(1);
// fetchSparkline(1, '0x6b175474e89094c44da98b954eedeac495271d0f');

function scheduleTrendingFetch(frequency, duration) {
  cron.schedule(frequency, () => {
    console.log(`Running fetch task for ${duration}hr data`);
    getTrending(duration);
  });
}

// Schedule the top tokens fetch
scheduleTrendingFetch('*/3 * * * *', 1); // Every hour, check every 3 minutes
scheduleTrendingFetch('*/10 * * * *', 4); // Every 4 hours, check every 10 mins
scheduleTrendingFetch('*/60 * * * *', 12); // Every 12 hours, check every 60 mins
scheduleTrendingFetch('0 */6 * * *', 24); // Every 24 hours (daily), check every 6 hours

module.exports = router;
