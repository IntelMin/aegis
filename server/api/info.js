const express = require("express");
const axios = require("axios");
const router = express.Router();
const { fetchData, readCache, writeCache } = require("../utils");

async function definedRequest(url, params) {
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
const expiry = 600000; // 10 minutes in milliseconds

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
    const response_data = await definedRequest(endpoint, request_data);

    console.log(`Fetched ${type} from API: `, response_data);

    const data = {
      time: currentTime,
      data: response_data,
    };

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

    const responseData = {
      token: token_info,
      // stats: token_stats,
      security: token_security,
      rugpull: token_rugpull,
    };

    res.status(200).send(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = router;
