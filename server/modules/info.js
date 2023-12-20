const { fetchAndCacheData, writeCache, readCache } = require("../utils");
const path = require("path");
const axios = require("axios");

async function definedRequest(address) {
  let graphql = {
    operationName: "GetTokens",
    variables: {
      ids: [
        {
          address: address,
          networkId: 1,
        },
      ],
    },
    query:
      "query GetTokens($ids: [TokenInput!]!) {\n  tokens(ids: $ids) {\n    address\n    decimals\n    id\n    name\n    networkId\n    symbol\n    imageLargeUrl\n    imageSmallUrl\n    imageThumbUrl\n    explorerData {\n      id\n      blueCheckmark\n      description\n      divisor\n      tokenPriceUSD\n      tokenType\n      __typename\n    }\n    info {\n      ...BaseTokenInfo\n      __typename\n    }\n    socialLinks {\n      bitcointalk\n      blog\n      coingecko\n      coinmarketcap\n      discord\n      email\n      facebook\n      github\n      instagram\n      linkedin\n      reddit\n      slack\n      telegram\n      twitch\n      twitter\n      website\n      wechat\n      whitepaper\n      youtube\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment BaseTokenInfo on TokenInfo {\n  address\n  circulatingSupply\n  id\n  imageLargeUrl\n  imageSmallUrl\n  imageThumbUrl\n  isScam\n  name\n  networkId\n  symbol\n  totalSupply\n  __typename\n}",
  };

  let request = JSON.stringify(graphql);

  try {
    const response = await axios.post(
      "https://graph.defined.fi/graphql",
      request,
      {
        headers: {
          authority: "graph.defined.fi",
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,ko;q=0.8",
          authorization: "e0f195aecd9fd4a41c387f38002ce1ce3783cf57",
          "content-type": "application/json",
          origin: "https://www.defined.fi",
          referer: "https://www.defined.fi/",
          "sec-ch-ua":
            '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
          "x-amz-user-agent": "aws-amplify/3.0.7",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error making the request", error);
    return null;
  }
}

async function getMetadata(address) {
  const filename = path.join(
    __dirname,
    `../cache/contracts/${address}/meta.json`
  );

  let filedata = await readCache(filename);

  if (filedata) {
    return filedata;
  } else {
    const response_data = await definedRequest(address);
    // console.log(`Fetched metadata from API: `, response_data);

    const data = response_data;

    await writeCache(filename, data);
    return response_data;
  }
}

async function getInfo(address) {
  try {
    await Promise.all([
      fetchAndCacheData(
        "info",
        `https://eth.blockscout.com/api/v2/tokens/${address}`,
        address
      ),
      fetchAndCacheData(
        "security",
        `https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=${address}`,
        address
      ),
      fetchAndCacheData(
        "rugpull",
        `https://api.gopluslabs.io/api/v1/rugpull_detecting/1?contract_addresses=${address}`,
        address
      ),
      fetchAndCacheData(
        "source",
        `https://eth.blockscout.com/api/v2/smart-contracts/${address}`,
        address
      ),
      getMetadata(address),
    ]);
  } catch (error) {
    console.error("Error in getInfo:", error);
    return false;
  }

  return true;
}

module.exports = getInfo;
