const { fetchData,fetchAndCacheData,writeCache, readCache,getCachedOrFreshData, supabase, modifyRequestdb } = require("./utils");
const OpenAI = require("openai");
const async = require("async");
const path = require("path");
const axios = require("axios");
const parser = require("@solidity-parser/parser");

const openai = new OpenAI({
    apiKey: "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",
  });
  function parseSolidity(content) {
    let parenthesis = 0;
    let currentContract = [];
    let contractSegments = [];
  
    // Split the content by new line and loop through each line
    content.split("\n").forEach((line) => {
      if (line.includes("{")) {
        parenthesis++;
      }
      if (line.includes("}")) {
        parenthesis--;
      }
      if (parenthesis !== 0) {
        currentContract.push(line);
        if (currentContract.length > 5) {
          contractSegments.push(currentContract.join("\n"));
          currentContract = [];
        }
      }
    });
  
    // Check if there's any remaining content in currentContract
    if (currentContract.length > 1) {
      contractSegments.push(currentContract.join("\n"));
    }
  
    return contractSegments;
  }
  function generateTree(content) {
    const ast = (() => {
      try {
        return parser.parse(content, { loc: true });
      } catch (err) {
        console.error(`\nError found while parsing one of the provided files\n`);
        throw err;
      }
    })();
  
    console.log("Contract AST loaded -- generateTree");
  
    const astTree = [];
    let currentContract = null;
  
    parser.visit(ast, {
      ContractDefinition(node) {
        const name = node.name;
        let bases = node.baseContracts
          .map((spec) => {
            return spec.baseName.namePath;
          })
          .join(", ");
  
        bases = bases.length ? `(${bases})` : "";
  
        let specs = "";
        if (node.kind === "library") {
          specs += "[Lib]";
        } else if (node.kind === "interface") {
          specs += "[Int]";
        }
  
        // console.log(` + ${specs} ${name} ${bases}`);
        const lineNumber = node.loc.start.line;
        currentContract = {
          type: "contract",
          name: name,
          bases: bases,
          specs: specs,
          line: lineNumber,
          functions: [],
        };
        astTree.push(currentContract);
        // console.log("line: ", lineNumber);
  
        // console.log(` + ${specs} ${name} ${bases} at line ${lineNumber}`);
      },
  
      "ContractDefinition:exit": function (node) {
        // console.log("");
        currentContract = null;
        // console.log("ContractDefinition:exit");
      },
  
      FunctionDefinition(node) {
        let name;
  
        if (node.isConstructor) {
          name = "<Constructor>";
        } else if (node.isFallback) {
          name = "<Fallback>";
        } else if (node.isReceiveEther) {
          name = "<Receive Ether>";
        } else {
          name = node.name;
        }
  
        let spec = "";
        if (node.visibility === "public" || node.visibility === "default") {
          spec += "[Pub]";
        } else if (node.visibility === "external") {
          spec += "[Ext]";
        } else if (node.visibility === "private") {
          spec += "[Prv]";
        } else if (node.visibility === "internal") {
          spec += "[Int]";
        }
  
        let payable = "";
        if (node.stateMutability === "payable") {
          payable = " ($)";
        }
  
        let mutating = "";
        if (!node.stateMutability) {
          mutating = " #";
        }
  
        let modifiers = "";
        for (let m of node.modifiers) {
          if (!!modifiers) modifiers += ",";
          modifiers += m.name;
        }
  
        // console.log(`    - ${spec} ${name}${payable}${mutating}`);
        const lineNumber = node.loc.start.line;
        const functionDef = {
          type: "func",
          name: name,
          spec: spec,
          payable: payable,
          modifiers: modifiers,
          line: lineNumber,
        };
  
        if (currentContract) {
          currentContract.functions.push(functionDef);
        }
  
        if (!!modifiers) {
          // console.log(`       - modifiers: ${modifiers}`);
        }
      },
    });
  
    return astTree;
  }
  
async function getFindings(codeSegments) {
    let findings = [];
  
    for (let i = 0; i < codeSegments.length; i++) {
      const segment = codeSegments[i];
  
      const chatCompletion = await getFinding(segment);
  
      // console.log(chatCompletion);
  
      try {
        // Attempt to parse the chatCompletion
        const parsedData = JSON.parse(chatCompletion);
        console.log("Code segment: ", segment);
        console.log("Valid JSON:", parsedData);
  
        findings.push(parsedData);
  
        // check if chatCompletion is a valid JSON
        // if (chatCompletion.includes("status")) {
        //   findings.push(chatCompletion);
        // }
      } catch (e) {
        console.log("Invalid JSON:", e);
      }
  
      console.log("Loop: ", i);
  
      // if (i > 0) {
      //   break;
      // }
    }
  
    return findings;
  }
  async function getFinding(code) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Aegis is an AI-powered assistant designed to audit smart contract code that only responds in JSON when user provides code.",
        },
        {
          role: "user",
          content: code,
        },
        {
          role: "system",
          content: `For the provided code segment provided above, report any vulnerabilities found in JSON format.
  
          Important: if there are no vulnerabilities are found, return a json object with the following format:
          {
            "status": "None",
          }
           `,
        },
      ],
      model: "ft:gpt-3.5-turbo-1106:personal::8KeRWVxf",
    });
  
    return chatCompletion.choices[0].message.content;
  }  
async function gptauditor(address){
    let filename = `./contracts/${address}.json`;
    let url = `https://eth.blockscout.com/api/v2/smart-contracts/${address}`;
    let filedata = await fetchData(filename, url);

    let source_code = filedata["source_code"];

    const findingsCacheFile = path.join(
    __dirname,
    `./data/${address}/findings.json`
  );
  
  let codeSegments = parseSolidity(source_code);
  // console.log("codeSegments: ", codeSegments);
  
  let findings = await getCachedOrFreshData(
  findingsCacheFile,
  getFindings,
  codeSegments
  );
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
  //GPT code audit part 
async function worker() {
  const { data: auditRequests, error:error_req } = await supabase
  .from('audit-requests')
  .select('*')

  //sorting pending and partial audits
  auditRequests.sort((a, b) => {
    if (a.status === "pending" && b.status === "partial") {
      return -1; // a comes before b
    } else if (a.status === "partial" && b.status === "pending") {
      return 1; // b comes before a
    } else {
      return 0; // no change in order
    }
  });
  console.log("auditRequests: ", auditRequests);
  auditRequests.map(async (row) => {
    const address = row.address;
    if(row.status === "pending"){
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

        //save token contract 

        let filename = `./contracts/${address}.json`;
        let url = `https://eth.blockscout.com/api/v2/smart-contracts/${address}`;
        let filedata = await fetchData(filename, url);

        let source_code = filedata["source_code"];
    
        const treeCacheFile = path.join(__dirname, `../data/${address}/tree.json`);
        // console.log("treeCacheFile: ", treeCacheFile);
        let treeJson = await getCachedOrFreshData(
          treeCacheFile,
          generateTree,
          source_code
          );
          modifyRequestdb(address,"partial")
      }
      catch(e){
        console.log(e)
      }
    }
    if(row.status === "partial"){
      await gptauditor(address)
      modifyRequestdb(address,"complete")
    }else{
      return null
    }
  });


;
  }
  // module.exports = worker;
  setInterval(worker, 5000);
