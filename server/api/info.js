const express = require("express");
const axios = require("axios");
const router = express.Router();
const { fetchData, readCache, writeCache } = require("../utils");

async function apiRequest(url, params) {
  try {
    const response = await axios.get(url, { params });
    // console.log("Response data: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error making the request", error);
    return null;
  }
}

const path = require("path");
const { get } = require("http");
const expiry = 3600000; // 10 minutes in milliseconds

async function fetchAndCacheData(type, endpoint, address) {
  const filename = path.join(__dirname, `../data/${address}/${type}.json`);
  const currentTime = new Date().getTime();
  let filedata = await readCache(filename);

  if (filedata && currentTime - filedata.time <= expiry) {
    console.log(`Fetching ${type} from cache.`);
    return filedata.data;
  } else {
    console.log(`Making request to ${type}.`);
    const request_data = {
      /* ... */
    }; // Customize this based on the endpoint
    const response_data = await apiRequest(endpoint, request_data);

    console.log(`Fetched ${type} from API: `, response_data);

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

  const response = await axios
    .post("https://graph.defined.fi/graphql", request, {
      headers: {
        authority: "graph.defined.fi",
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,ko;q=0.8",
        authorization: "F056MdQIqh29ZGalfV1m2BChqdQcae84k7wIFBA7",
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
    })
    .then((response) => {
      // console.log("response: ", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error making the request", error);
      return null;
    });

  // console.log("response: ", response.data);
  return response.data;
}

async function getMetadata(address) {
  const filename = path.join(__dirname, `../data/${address}/meta.json`);

  let filedata = await readCache(filename);

  if (filedata) {
    return filedata;
  } else {
    const response_data = await definedRequest(address);
    console.log(`Fetched metadata from API: `, response_data);

    const data = response_data;

    await writeCache(filename, data);
    return response_data;
  }
}

router.get("/:address", async (req, res) => {
  const address = req.params.address;

  console.log("info request: ", address);

  if (!address) {
    return res.status(400).send("No address provided");
  }

  try {
    const token_info = await fetchAndCacheData(
      "info",
      `https://eth.blockscout.com/api/v2/tokens/${address}`,
      address
    );

    // const token_stats = await fetchAndCacheData("stats", `https://eth.blockscout.com/api/v2/tokens/${address}/stats`, address);
    const token_security = await fetchAndCacheData(
      "security",
      `https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=${address}`,
      address
    );
    const token_rugpull = await fetchAndCacheData(
      "rugpull",
      `https://api.gopluslabs.io/api/v1/rugpull_detecting/1?contract_addresses=${address}`,
      address
    );

    const metadata = await getMetadata(address);

    const keys = Object.keys(token_security.result);
    const parse_security = token_security.result[keys[0]];
    let parse_rugpull = token_rugpull["result"];
    let parse_meta = metadata["tokens"][0];

    console.log("Security: ", parse_security);

    const responseData = {
      token: token_info,
      metadata: parse_meta,
      // stats: token_stats,
      security: parse_security,
      rugpull: parse_rugpull,
    };

    res.status(200).send(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = router;
