const path = require('path');
const axios = require('axios');
const { getCached, fetchCache, readCache } = require('../lib/file');
const { fetchTokens } = require('../lib/third-party/defined');
const etherscanRequest = require('../lib/third-party/etherscan');

async function getMetadata(address) {
  const variables = {
    ids: [
      {
        address: address,
        networkId: 1,
      },
    ],
  };

  const data = await fetchTokens(variables);
  if (data) {
    return data.data;
  } else {
    return null;
  }
}

async function getScan(address) {
  try {
    const response = await axios.post(
      'https://www.coinscope.co/api/search/cyberscan',
      {
        address: address,
        network: 'ETH',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error making the request', error);
    return null;
  }
}

async function getSource(address) {
  try {
    let data = await etherscanRequest('contract', 'getsourcecode', {
      address: address,
    });

    return data;
  } catch (error) {
    console.error('Error making the request', error);
    return null;
  }
}

async function getPair(filepath, address) {
  try {
    const { CurlImpersonate } = require('node-curl-impersonate');

    const security = await readCache(filepath + 'security.json');
    const tokenData = security.result[Object.keys(security.result)[0]];
    const dexes = tokenData.dex;

    let highestLiquidityDex = dexes[0];
    for (const dex of dexes) {
      if (
        parseFloat(dex.liquidity) > parseFloat(highestLiquidityDex.liquidity)
      ) {
        highestLiquidityDex = dex;
      }
    }

    const pair = highestLiquidityDex.pair;

    const url = `https://www.dextools.io/shared/data/pair?address=${pair}&chain=ether&audit=true&locks=true`;

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,ko;q=0.8',
        Referer: `https://www.dextools.io/app/en/ether/pair-explorer/${pair}`,
        'Sec-Ch-Ua':
          '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      impersonate: 'chrome-110',
      verbose: false,
    };

    const curl = new CurlImpersonate(url, options);

    curl
      .makeRequest()
      .then(response => {
        data = response.response;
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
        return null;
      });
  } catch (error) {
    return null;
  }
}

const requestRegistry = {};

async function getInfo(address) {
  const filepath = './cache/contracts/' + address + '/';

  if (requestRegistry[address]) {
    console.log(`Waiting for ongoing request for address: ${address}`);
    return requestRegistry[address];
  }

  const requestPromise = (async () => {
    try {
      await Promise.all([
        fetchCache(
          filepath + 'info.json',
          `https://eth.blockscout.com/api/v2/tokens/${address}`,
          1
        ),
        getCached(filepath + 'meta.json', getMetadata, 3600, address),
        getCached(filepath + 'source.json', getSource, 43200, address),
        fetchCache(
          filepath + 'security.json',
          `https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=${address}`,
          1,
          3600
        ),
        fetchCache(
          filepath + 'rugpull.json',
          `https://api.gopluslabs.io/api/v1/rugpull_detecting/1?contract_addresses=${address}`,
          1,
          3600
        ),
        getCached(filepath + 'scan.json', getScan, 3600, address),
      ]);

      await getCached(filepath + 'pair.json', getPair, 3600, filepath, address);

      return true;
    } catch (error) {
      console.error('Error in getInfo:', error);
      return false;
    } finally {
      delete requestRegistry[address];
    }
  })();

  requestRegistry[address] = requestPromise;
  return requestPromise;
}

module.exports = getInfo;
