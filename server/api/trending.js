const express = require("express");
const axios = require("axios");
const router = express.Router();
const { fetchData, readCache, writeCache } = require("../utils");

async function definedRequest(graphql) {
  let request = JSON.stringify(graphql);

  // console.log("request: ", request);

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

router.get("/:type", async (req, res) => {
  const type = req.params.type;

  console.log("trending request: ", type);

  // const { address } = req.body;

  if (!type) {
    return res.status(400).send("No type provided");
  }

  let expiry = 0;
  let request_data = null;
  let response_data = null;

  try {
    if (type == "top") {
      request_data = {
        operationName: "ListTopTokens",
        variables: {
          networkFilter: [1],
          resolution: "1D",
          limit: 10,
        },
        query:
          "query ListTopTokens($networkFilter: [Int!], $resolution: String, $limit: Int) {\n  listTopTokens(\n    networkFilter: $networkFilter\n    resolution: $resolution\n    limit: $limit\n  ) {\n    createdAt\n    lastTransaction\n    marketCap\n    txnCount1\n    txnCount4\n    txnCount12\n    txnCount24\n    uniqueBuys1\n    uniqueBuys4\n    uniqueBuys12\n    uniqueBuys24\n    uniqueSells1\n    uniqueSells4\n    uniqueSells12\n    uniqueSells24\n    ...BaseTokenWithMetadata\n    __typename\n  }\n}\n\nfragment BaseTokenWithMetadata on TokenWithMetadata {\n  address\n  decimals\n  exchanges {\n    ...ExchangeModel\n    __typename\n  }\n  id\n  imageLargeUrl\n  imageSmallUrl\n  imageThumbUrl\n  liquidity\n  name\n  networkId\n  price\n  priceChange\n  priceChange1\n  priceChange12\n  priceChange24\n  priceChange4\n  quoteToken\n  resolution\n  symbol\n  topPairId\n  volume\n  __typename\n}\n\nfragment ExchangeModel on Exchange {\n  address\n  color\n  exchangeVersion\n  id\n  name\n  networkId\n  tradeUrl\n  iconUrl\n  enabled\n  __typename\n}",
      };

      // set expiry to 10 minutes
      expiry = 600;
    } else if (type == "new") {
      request_data = {
        operationName: "GetLatestPairs",
        variables: {
          limit: 30,
          networkFilter: [1],
          exchangeFilter: [
            "0x115934131916c8b277dd010ee02de363c09d037c",
            "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f",
            "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac",
            "0x1f98431c8ad98523631ae4a59f267346ea31f984",
            "0xe9c29cb475c0ade80be0319b74ad112f1e80058f",
            "0x0a1c657b839a7fe9a976ffd4ac5a1a363de3ee69",
            "0x4be5bf2233a0fd2c7d1472487310503ec8e857be",
            "0xda257cbe968202dea212bbb65ab49f174da58b9d",
            "0x5757371414417b8c6caad45baef941abc7d3ab32",
            "0xafd37a86044528010d0e70cdc58d0a9b5eb03206",
            "0xef45d134b73241eda7703fa787148d9c9f4950b0",
            "0x01d43af9c2a1e9c5d542c2299fe5826a357eb3fe",
            "0x7cbda25d97dcc7b731aa9f6e9a88ec75dabc9f48",
            "0x17854c8d5a41d5a89b275386e24b2f38fd0afbdd",
            "0x017603c8f29f7f6394737628a93c57ffba1b7256",
            "0xfda619b6d20975be80a10332cd39b9a4b0faa8bb",
            "0xf5719b1ea3c9bf6491e22c49379e31060d0fbfc1",
            "0x1125c5f53c72efd175753d427aa116b972aa5537",
            "0xb0b670fc1f7724119963018db0bfa86adb22d941",
            "0x2cdfb20205701ff01689461610c9f321d1d00f80",
            "0xca143ce32fe78f1f7019d7d551a6402fc5350c73",
            "0xedd87163c213de62b581b7141cb454f3c4d2086e",
            "0x7ceb5f3a6d1888eec74a41a5377afba5b97200ea",
            "0x73a48f8f521eb31c55c0e1274db0898de599cb11",
            "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
            "0x858e3312ed3a876947ea49d572a7c42de08af7ee",
            "0x6168d508ad65d87f8f5916986b55d134af7153bb",
            "0x68a384d826d3678f78bb9fb1533c7e9577dacc0e",
            "0xf36ae63d89983e3aea8aaad1086c3280eb01438d",
            "0x9dd422b52618f4edd13e08c840f2b6835f3c0585",
            "0x5f50fdc22697591c1d7bfbe8021163fc73513653",
            "0xf4bc79d32a7defd87c8a9c100fd83206bbf19af5",
            "0x6008247f53395e7be698249770aa1d2bfe265ca0",
            "0x9ad6c38be94206ca50bb0d90783181662f0cfa10",
            "0x42d6041342021bc317796c6a0f10ce39346e9167",
            "0x62d5b84be28a183abb507e125b384122d2c25fae",
            "0xe7fb3e833efe5f9c441105eb65ef8b261266423b",
            "0xafd89d21bdb66d00817d4153e055830b1c2b3970",
            "0x9a272d734c5a0d7d84e0a892e891a553e8066dce",
            "0xcefbebf0b85b1638c19b01ce2a02c262f421b07d",
            "0xc6366efd0af1d09171fe0ebf32c7943bb310832a",
            "0xac2ee06a14c52570ef3b9812ed240bce359772e7",
            "0x33128a8fc17869897dce68ed026d694621f6fdfd",
            "0x049581aeb6fe262727f290165c29bdab065a1b68",
            "0x9014b937069918bd319f80e8b3bb4a2cf6faa5f7",
            "0xe387067f12561e579c5f7d4294f51867e0c1cfba",
            "0x26e13874ad1cd512b29795dafe3937e1c6f6d507",
            "0xbcfccbde45ce874adcb698cc183debcf17952812",
            "0x70f51d68d16e8f9e418441280342bd43ac9dff9f",
            "0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7",
            "0x1d21db6cde1b18c7e47b0f7f42f4b3f68b9beec9",
            "0x5d48c95adffd4b40c1aaadc4e08fc44117e02179",
            "0xac9d019b7c8b7a4bbac64b2dbf6791ed672ba98b",
            "0xe140eac2bb748c8f456719a457f26636617bb0e9",
            "0x065c8703132f2a38be3d2dbf7be6be455930560c",
            "0x2ef06a90b0e7ae3ae508e83ea6628a3987945460",
            "0x9cc7c769ea3b37f1af0ad642a268b80dc80754c5",
            "0x759e390d946249c63e0a1d8a810c5a577a591719",
            "0x97bcd9bb482144291d77ee53bfa99317a82066e8",
            "0x3d237ac6d2f425d2e890cc99198818cc1fa48870",
            "0x794c07912474351b3134e6d6b3b7b3b4a07cbaaa",
            "0xe2a6f7c0ce4d5d300f97aa7e125455f5cd3342f5",
            "0x3b44b2a187a7b3824131f8db5a74194d0a42fc15",
            "0xa780fcbff7c5232fdbef4fc67313becffdf64172",
            "0x6eccab422d763ac031210895c81787e87b43a652",
            "0xa818b4f111ccac7aa31d0bcc0806d64f2e0737d7",
            "0xae4ec9901c3076d0ddbe76a520f9e90a6227acb7",
            "0xaabe38153b25f0d4b2bda620f67059b3a45334e5",
            "0x8bcedd62dd46f1a76f8a1633d4f5b76e0cda521e",
            "0xe68aa3e7a8cd86b59ac99c1a3d2d8a08c9ed4182",
            "0x7d02c116b98d0965ba7b642ace0183ad8b8d2196",
            "0x7ddaf116889d655d1c486beb95017a8211265d29",
            "0x1998e4b0f1f922367d8ec20600ea2b86df55f34e",
            "0xd27d9d61590874bf9ee2a19b27e265399929c9c3",
            "0xc78ed571d8a5b483cd7553fa4058cb8ec7a72649",
            "0xf5fc2d145381a2ebafb93cc2b60fb2b97fb405aa",
            "0xd3ea3bc1f5a3f881bd6ce9761cba5a0833a5d737",
            "0x6369e8dfad8db8378179d74c187f1d5dea47fa9f",
            "0x7bbbb6abad521de677abe089c85b29e3b2021496",
            "0x40be1cba6c5b47cdf9da7f963b6f761f4c60627d",
            "0xcf083be4164828f00cae704ec15a36d711491284",
            "0x6abdda34fb225be4610a2d153845e09429523cd2",
          ],
          minLiquidityFilter: 1000,
        },
        query:
          "query GetLatestPairs($networkFilter: [Int!], $exchangeFilter: [String!], $limit: Int, $minLiquidityFilter: Int, $cursor: String) {\n  getLatestPairs(\n    networkFilter: $networkFilter\n    exchangeFilter: $exchangeFilter\n    limit: $limit\n    minLiquidityFilter: $minLiquidityFilter\n    cursor: $cursor\n  ) {\n    cursor\n    items {\n      address\n      exchangeHash\n      id\n      initialPriceUsd\n      liquidAt\n      liquidity\n      liquidityToken\n      networkId\n      newToken\n      nonLiquidityToken\n      oldToken\n      priceChange\n      priceUsd\n      transactionHash\n      token0 {\n        address\n        currentPoolAmount\n        decimals\n        id\n        initialPoolAmount\n        name\n        networkId\n        pairId\n        poolVariation\n        symbol\n        __typename\n      }\n      token1 {\n        address\n        currentPoolAmount\n        decimals\n        id\n        initialPoolAmount\n        name\n        networkId\n        pairId\n        poolVariation\n        symbol\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}",
      };

      // set expiry to 1 minute
      expiry = 60;
    }

    // get file from cache
    let filename = `./cache/${type}.json`;

    // get current time
    let currentTime = new Date().getTime();

    // load data from cache via fs
    let filedata = await readCache(filename);

    // check if filedata is null
    let live_fetch = false;
    if (filedata == null) {
      live_fetch = true;
    } else {
      // check if filedata is older than 10 minutes
      let fileTime = filedata["time"];
      if (currentTime - fileTime > expiry) {
        live_fetch = true;
      }
    }

    // live_fetch = true;

    if (live_fetch) {
      console.log("Making the reqest.");
      defined_data = await definedRequest(request_data);

      console.log("Fetched from API: ", defined_data);

      // json_data = JSON.parse(defined_data);

      // console.log("json_data: ", json_data);

      if (type == "top") {
        response_data = defined_data["listTopTokens"];
      } else {
        response_data = defined_data["getLatestPairs"];
      }

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

    res.status(200).send(response_data);
  } catch (error) {
    // console.log(error);
    // res.status(500).send("Error: " + error);
  }
});

module.exports = router;
