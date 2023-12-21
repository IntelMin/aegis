const express = require("express");
const router = express.Router();
const {
  fetchData,
  readCache,
  writeCache,
  definedRequest,
} = require("../utils");
const { sha256 } = require("viem");

const getData = async (request_data, expiry) => {
  const type = sha256(JSON.stringify(request_data));

  let filename = `./cache/monitor/${type}.json`;

  // get current time
  let currentTime = new Date().getTime();

  // load data from cache via fs
  let filedata = await readCache(filename);

  // check if filedata is null
  let live_fetch = false;
  let response_data = null;

  if (filedata == null) {
    live_fetch = true;
  } else {
    // check if filedata is older than 10 minutes
    let fileTime = filedata["time"];
    if (currentTime - fileTime > expiry) {
      live_fetch = true;
    }
  }

  if (live_fetch) {
    console.log("Making the reqest.");
    response_data = await definedRequest(request_data);

    if (response_data == null) {
      throw new Error("wrong respond");
    }

    console.log("Fetched from API: ", response_data);

    // save data to cache with current time
    let data = {
      time: currentTime,
      data: response_data,
    };

    await writeCache(filename, data);
  } else {
    console.log("Fetching from cache.");
    response_data = filedata["data"];
  }

  return response_data;
};

router.get("/all_token", async (req, res) => {
  try {
    res.status(200).send(
      await getData(
        {
          query: `{
            getNetworks {
              name
              id
            }
          }`,
        },
        600000
      )
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/getpairmetadata", async (req, res) => {
  try {
    const pairId = req.body.pairId;
    const quoteToken = req.body.quoteToken || "token0"; // "token0" or "token1"
    const statsType = req.body.statsType || "UNFILTERED"; // "FILTERED" or "UNFILTERED"

    if (pairId) {
      res.status(200).send(
        await getData({
          operationName: "GetPairMetadata",
          variables: {
            pairId: pairId,
            quoteToken: quoteToken,
            statsType: statsType,
          },
          query:
            "query GetPairMetadata($pairId: String!, $quoteToken: QuoteToken, $statsType: TokenPairStatisticsType) {\n  pairMetadata(pairId: $pairId, quoteToken: $quoteToken, statsType: $statsType) {\n    price\n    exchangeId\n    fee\n    id\n    liquidity\n    liquidityToken\n    nonLiquidityToken\n    pairAddress\n    priceChange: priceChange24\n    priceChange1\n    priceChange12\n    priceChange24\n    priceChange4\n    tickSpacing\n    volume: volume24\n    volume1\n    volume12\n    volume24\n    volume4\n    quoteToken\n    statsType\n    token0 {\n      address\n      decimals\n      name\n      networkId\n      pooled\n      price\n      symbol\n      labels {\n        type\n        subType\n        createdAt\n        __typename\n      }\n      __typename\n    }\n    token1 {\n      address\n      decimals\n      name\n      networkId\n      pooled\n      price\n      symbol\n      labels {\n        type\n        subType\n        createdAt\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}",
        })
      );
    } else {
      res.status(500).send("Please Select pairId");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
