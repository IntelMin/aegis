const ethers = require('ethers');
const NodeCache = require('node-cache');

const risk_cache = new NodeCache();

async function processAddressesFromQueue(addressQueue, node, io) {
  const isRisky = async address => {
    const cachedResult = risk_cache.get(String(address));
    if (cachedResult) {
      return cachedResult;
    }

    const baseUrl = `https://openapi.misttrack.io/v1/risk_score?coin=ETH&address=${address}&api_key=Wu2CtDngjSy7FxRZ59OXpzbcMLP6lwB1`;
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(baseUrl, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        console.log('Error fetching risk data:', response);
      }

      const data = await response.json();

      if (data.success) {
        risk_cache.set(String(address), data.data);
        console.log('Risk data:', data.data);
        return data.data;
      } else {
        // console.error('Error fetching risk data:', data);
        return null;
      }
    } catch (error) {
      //   console.error('Error fetching address data:', error);
      return null;
      // throw error;
    }
  };

  const processAddress = async tx => {
    try {
      const results = [];
      const risk = await isRisky(tx.address);

      if (risk && risk.score > 3) {
        results.push({
          type: 'risk',
          data: {
            hash: tx.hash,
            address: tx.address,
            risk,
          },
        });

        io.emit('log', results);
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      return null;
    }
  };

  const RATE_LIMIT = 1; // address per second, adjustable

  while (true) {
    if (addressQueue.length > 0) {
      const addressesToProcess = addressQueue.splice(0, RATE_LIMIT);
      await Promise.all(addressesToProcess.map(tx => processAddress(tx)));

      // Calculate delay for rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      // No transactions to process, short delay to reduce CPU usage
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

module.exports = processAddressesFromQueue;
