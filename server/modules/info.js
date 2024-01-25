const path = require('path');
const axios = require('axios');
const { getCached, fetchCache } = require('../lib/file');
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
