const express = require("express");
const axios = require("axios");

const router = express.Router();
const {
  fetchData,
  readCache,
  writeCache,
  definedRequest,
  chainbaseRequest,
} = require("../utils");
const { sha256 } = require("viem");

const getData = async (request_data, expiry = 600000, type = 1) => {
  const hash = sha256(JSON.stringify(request_data));

  let filename = `./cache/monitor/${hash}.json`;

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
    if (type == 1) {
      response_data = await definedRequest(request_data);
    } else if (type == 2) {
      response_data = await chainbaseRequest(request_data);
    } else {
      throw new Error("wrong input");
    }

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

router.post("/getbars", async (req, res) => {
  try {
    const symbol = req.body.symbol;
    const resolution = req.body.resolution || 15;
    const from = parseInt(req.body.from);
    const to = parseInt(req.body.to);
    const currencyCode = req.body.currencyCode || "USD";
    const statsType = req.body.statsType || "UNFILTERED"; // "FILTERED" or "UNFILTERED"
    const quoteToken = req.body.quoteToken || "token0"; // "token0" or "token1"

    if (symbol && from && to) {
      res.status(200).send(
        await getData({
          operationName: "GetBars",
          variables: {
            symbol: symbol,
            resolution: resolution,
            from: from,
            to: to,
            currencyCode: currencyCode,
            statsType: statsType,
            quoteToken: quoteToken,
          },
          query:
            "query GetBars($symbol: String!, $from: Int!, $to: Int!, $resolution: String!, $currencyCode: String, $quoteToken: QuoteToken, $statsType: TokenPairStatisticsType) {\n  getBars(\n    symbol: $symbol\n    from: $from\n    to: $to\n    resolution: $resolution\n    currencyCode: $currencyCode\n    quoteToken: $quoteToken\n    statsType: $statsType\n  ) {\n    o\n    h\n    l\n    c\n    t\n    s\n    volume\n    __typename\n  }\n}",
        })
      );
    } else {
      res.status(500).send("Invalid Parameter");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/gettokenevents", async (req, res) => {
  try {
    const quoteToken = req.body.quoteToken || "token0"; // "token0", "token1"
    const direction = req.body.direction || "DESC"; // "DESC", "ASC"
    const limit = parseInt(req.body.limit) || 30; // 30
    const address = req.body.address;
    const networkId = parseInt(req.body.networkId) || 1;

    if (address) {
      res.status(200).send(
        await getData({
          operationName: "GetTokenEvents",
          variables: {
            query: {
              quoteToken: quoteToken,
              address: address,
              networkId: networkId,
            },
            limit: limit,
            direction: direction,
          },
          query:
            "query GetTokenEvents($limit: Int, $query: EventsQueryInput!, $cursor: String, $direction: RankingDirection) {\n  getTokenEvents(\n    limit: $limit\n    query: $query\n    cursor: $cursor\n    direction: $direction\n  ) {\n    items {\n      address\n      baseTokenPrice\n      blockNumber\n      eventDisplayType\n      eventType\n      id\n      liquidityToken\n      logIndex\n      maker\n      timestamp\n      token0SwapValueUsd\n      token0ValueBase\n      token1SwapValueUsd\n      token1ValueBase\n      transactionHash\n      labels {\n        sandwich {\n          label\n          sandwichType\n          token0DrainedAmount\n          token1DrainedAmount\n          __typename\n        }\n        __typename\n      }\n      transactionIndex\n      quoteToken\n      data {\n        __typename\n        ... on BurnEventData {\n          amount0\n          amount1\n          amount0Shifted\n          amount1Shifted\n          type\n          __typename\n        }\n        ... on MintEventData {\n          amount0\n          amount1\n          amount0Shifted\n          amount1Shifted\n          type\n          __typename\n        }\n        ... on SwapEventData {\n          amount0In\n          amount0Out\n          amount1In\n          amount1Out\n          amount0\n          amount1\n          amountNonLiquidityToken\n          priceUsd\n          priceUsdTotal\n          priceBaseToken\n          priceBaseTokenTotal\n          type\n          __typename\n        }\n      }\n      __typename\n    }\n    cursor\n    __typename\n  }\n}",
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

router.post("/gettopholders", async (req, res) => {
  try {
    const limit = parseInt(req.body.limit) || 20; // 30
    const page = parseInt(req.body.page) || 1; // 30
    const address = req.body.address;
    const networkId = parseInt(req.body.networkId) || 1;
    // const address = "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0";

    if (address) {
      res.status(200).send(
        await getData({
          chain_id: networkId,
          contract_address: address,
          page: page,
          limit: limit,
        }, 60000000, 2)
      );
    } else {
      res.status(500).send("Please Select address");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
