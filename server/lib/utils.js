// utils.js
const fs = require('fs').promises;
const fss = require('fs');
const axios = require('axios');
const path = require('path');
const crypto = require('crypto');
const supabase = require('./supabase');

async function isContractOpenSource(address) {
  const apiKey = 'EYEC357Q2UY267KX88U25HZ57KIPNT4CYB'; // Replace with your Etherscan API key
  const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;

  const response = await axios.get(url);
  const data = response.data;

  // If the contract is open source, the sourceCode field will not be empty
  return data.result[0].SourceCode !== '';
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

const fetchData = async (file, url) => {
  try {
    await fs.access(file);
    const fileData = await fs.readFile(file, 'utf8');
    const jsonData = JSON.parse(fileData);
    return jsonData;
  } catch (fileError) {
    const response = await axios.get(url);
    console.log('Fetched file from URL');

    // Convert JSON object to a string
    const result = JSON.stringify(response.data, null, 2); // The null and 2 arguments format the JSON for readability

    // Write the JSON string to a file
    if (!fss.existsSync(path.dirname(file))) {
      await fs.mkdir(path.dirname(file));
    }

    await fs.writeFile(file, result, 'utf8');
    console.log('File saved successfully');

    return result;
  }
};

const readCache = async filename => {
  try {
    let data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or there is an error, return null
    return null;
  }
};

const writeCache = async (filename, data) => {
  const dir = path.dirname(filename);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filename, JSON.stringify(data), 'utf8');
};
async function apiRequest(url, params) {
  try {
    const response = await axios.get(url, { params });
    // console.log("Response data: ", response.data);
    return response.data;
  } catch (error) {
    console.error('Error making the request', error);
    return null;
  }
}
async function fetchAndCacheData(type, endpoint, address) {
  const filename = `./cache/contracts/${address}/${type}.json`;
  const currentTime = new Date().getTime();
  let filedata = await readCache(filename);
  const expiry = 3600000;
  if (filedata && currentTime - filedata.time <= expiry) {
    console.log(`Fetching ${type} from cache.`);
    return filedata.data;
  } else {
    console.log(`Making request to ${type}.`);
    const request_data = {
      /* ... */
    }; // Customize this based on the endpoint
    const response_data = await apiRequest(endpoint, request_data);

    console.log(`Fetched ${type} from API:`);

    // don't cache if there is no data
    if (!response_data) {
      return null;
    }

    const data = {
      time: currentTime,
      data: response_data,
    };

    await writeCache(filename, data);
    return response_data;
  }
}
const getCachedOrFreshData = async (
  cacheFilename,
  dataFunction,
  ...dataArgs
) => {
  // Check if the cached file exists
  console.log('--- cacheFilename: ', cacheFilename);
  let cachedData = await readCache(cacheFilename);
  if (cachedData !== null) {
    // If cache is available, return it
    return cachedData;
  } else {
    // Otherwise, get fresh data, save to cache, and return it
    let freshData = await dataFunction(...dataArgs);
    await writeCache(cacheFilename, freshData);
    return freshData;
  }
};

function getCachedData(cacheFilePath) {
  let cache = readCache(cacheFilePath);
  //   console.log(cache);
  if (cache !== null) {
    // const cacheData = fs.readFileSync(cacheFilePath, 'utf8');
    return JSON.parse(cache);
  } else {
    return null;
  }
}
async function isERC20Token(address) {
  const token_info = await fetchAndCacheData(
    'info',
    `https://eth.blockscout.com/api/v2/tokens/${address}`,
    address
  );
  return token_info.type === 'ERC-20';
}

// Function to insert data into a Supabase table
async function insertRequestdb(data) {
  try {
    const { data: insertedData, error } = await supabase
      .from('audit_requests')
      .insert(data);

    if (error) {
      console.log('Error inserting data: ', error);
      throw new Error(error.message);
    }

    return insertedData;
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
}
async function modifyRequestdb(address, newStatus, error_log = '') {
  try {
    const { data: updatedData, error } = await supabase
      .from('audit_requests')
      .update({ status: newStatus, status_log: error_log })
      .eq('contract', address);

    if (error) {
      console.log('Error modifying row: ', error);
      throw new Error(error.message);
    }

    return updatedData;
  } catch (error) {
    console.error('Error modifying row:', error);
  }
}

function hashString(input) {
  // Choose the hashing algorithm (e.g., 'sha256', 'md5', 'sha512', etc.)
  const algorithm = 'sha256';

  // Create a hash object
  const hash = crypto.createHash(algorithm);

  // Update the hash object with the input string
  hash.update(input);

  // Get the hexadecimal representation of the hash
  const hashedString = hash.digest('hex');

  return hashedString;
}

async function axiosgetapi(url, config) {
  return await axios
    .get(url, config)
    .then(response => {
      if (!response.data) {
        throw Error('Invalid Response');
      }
      // console.log("response: ", response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error making the request', error);
      throw new Error(error);
    });
}

async function axiospostapi(url, params, config) {
  return await axios
    .post(url, params, config)
    .then(response => {
      if (!response) {
        throw Error('Invalid Response');
      }
      // console.log("response: ", response.data);
      return response;
    })
    .catch(error => {
      console.error('Error making the request', error);
      throw new Error(error);
    });
}

async function definedRequest(graphql) {
  const response = await axiospostapi(
    'https://graph.defined.fi/graphql',
    graphql,
    {
      headers: {
        authority: 'graph.defined.fi',
        authorization: 'e0f195aecd9fd4a41c387f38002ce1ce3783cf57',
        'content-type': 'application/json',
      },
    }
  );

  // console.log("response: ", response.data);
  if (response && response.data) {
    if (response.data) {
      return response.data;
    }
    throw new Error(response.errors[0].message);
  }

  return null;
}

async function bitqueryRequest(data, type) {
  let bitqueryURL = null;
  if (type == 1) bitqueryURL = 'https://graphql.bitquery.io';
  else if (type == 2) bitqueryURL = 'https://streaming.bitquery.io/graphql';

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: bitqueryURL,
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': 'BQYCM5b6nhLQPR7V9zCTG1kgEgOJvNUY',
      Authorization:
        'Bearer ory_at_4b1fr2aub507i9xgAJe6qArHPsCXSqwsTNhmlllab6s.30nGgq4X_Yn5X8Ah7yi1h1bY3QBsW7ikb0yf5ElHtrg',
    },
    data: data,
  };

  const response = await axios.request(config);
  if (response && response.data) {
    if (response.data) {
      return JSON.stringify(response.data);
    }
    throw new Error(response.errors[0].message);
  }

  return null;
}

async function chainbaseRequest(params) {
  const response = await axiosgetapi(
    'https://api.chainbase.online/v1/token/top-holders',
    {
      headers: {
        'content-type': 'application/json',
        'X-API-Key': 'demo',
      },
      params: params,
    }
  );

  // console.log("response: ", response.data);
  if (response) {
    return response;
  }

  return null;
}

module.exports = {
  fileExists,
  getCachedOrFreshData,
  isERC20Token,
  getCachedData,
  readCache,
  writeCache,
  fetchData,
  isContractOpenSource,
  insertRequestdb,
  modifyRequestdb,
  supabase,
  fetchAndCacheData,
  hashString,
  definedRequest,
  chainbaseRequest,
  bitqueryRequest,
};
