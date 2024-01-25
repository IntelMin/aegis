// utils.js
const fs = require('fs').promises;
const fss = require('fs');
const axios = require('axios');
const path = require('path');
const crypto = require('crypto');
const supabase = require('./supabase');

// TODO: Move to third-party/etherscan.js
async function isContractOpenSource(address) {
  const apiKey = 'EYEC357Q2UY267KX88U25HZ57KIPNT4CYB'; // Replace with your Etherscan API key
  const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;

  const response = await axios.get(url);
  const data = response.data;

  // If the contract is open source, the sourceCode field will not be empty
  return data.result[0].SourceCode !== '';
}

// TODO: Move to third-party/etherscan.js
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

// TODO: Move to third-party/bitquery.js
// async function bitqueryRequest(data, type) {
//   let bitqueryURL = null;
//   if (type == 1) bitqueryURL = 'https://graphql.bitquery.io';
//   else if (type == 2) bitqueryURL = 'https://streaming.bitquery.io/graphql';

//   let config = {
//     method: 'post',
//     maxBodyLength: Infinity,
//     url: bitqueryURL,
//     headers: {
//       'Content-Type': 'application/json',
//       'X-API-KEY': 'BQYCM5b6nhLQPR7V9zCTG1kgEgOJvNUY',
//       Authorization:
//         'Bearer ory_at_4b1fr2aub507i9xgAJe6qArHPsCXSqwsTNhmlllab6s.30nGgq4X_Yn5X8Ah7yi1h1bY3QBsW7ikb0yf5ElHtrg',
//     },
//     data: data,
//   };

//   const response = await axios.request(config);
//   if (response && response.data) {
//     if (response.data) {
//       return JSON.stringify(response.data);
//     }
//     throw new Error(response.errors[0].message);
//   }

//   return null;
// }

// TODO: Remove this function
// async function chainbaseRequest(params) {
//   const response = await axiosgetapi(
//     'https://api.chainbase.online/v1/token/top-holders',
//     {
//       headers: {
//         'content-type': 'application/json',
//         'X-API-Key': 'demo',
//       },
//       params: params,
//     }
//   );

//   // console.log("response: ", response.data);
//   if (response) {
//     return response;
//   }

//   return null;
// }

function flattenSourcecode(sourcecode) {
  let source_code = sourcecode[0];
  source_code = source_code.SourceCode;

  // Check if sourceCode is wrapped with {{ }}
  if (source_code.startsWith('{{') && source_code.endsWith('}}')) {
    source_code = source_code.slice(1, -1);
  }

  source_code = JSON.parse(source_code);

  console.log('-- source.json');

  let flattenedSource = '';

  if (source_code && typeof source_code.sources === 'object') {
    for (const file in source_code.sources) {
      if (source_code.sources.hasOwnProperty(file)) {
        flattenedSource += source_code.sources[file].content + '\n\n';
      }
    }
  }

  return flattenedSource.trim();
}

module.exports = {
  isERC20Token,
  isContractOpenSource,
  insertRequestdb,
  modifyRequestdb,
  supabase,
  hashString,
  flattenSourcecode,
};
