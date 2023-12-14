const { getCachedOrFreshData } = require("./utils");
const prompt = require("./template_prompt");
const OpenAI = require("openai");
const fs = require("fs").promises;
const fss = require("fs");
const path = require("path");
const openai = require("./openai");

const getFunctionsData = async (props) => {
  let internalCount = 0;
  let publicCount = 0;
  let pureCount = 0;
  let viewCount = 0;
  let payableCount = 0;
  let totalFunctions = 0;

  props.functions.tableRows.forEach((row) => {
    if (row.type === "func") {
      totalFunctions++;
      if (row.spec.includes("Internal 🔒")) {
        internalCount++;
      } else if (row.spec.includes("Public ❗️")) {
        publicCount++;
      }
    }
  });
  props.source.data.abi.forEach((item) => {
    if (item.type === "function") {
      if (item.stateMutability === "pure") {
        pureCount++;
      } else if (item.stateMutability === "view") {
        viewCount++;
      } else if (item.payable) {
        payableCount++;
      }
    }
  });

  const privateFunctionPattern = /function\s+\w+\s*\([^)]*\)\s*private/g;
  const payableFunctionPattern = /function\s+\w+\s*\([^)]*\)\s*payable/g;
  const pureFunctionPattern = /function\s+\w+\s*\([^)]*\)\s*pure/g;

  const privateMatches = props.source.data.source_code.match(
    privateFunctionPattern
  );
  const payableMatches = props.source.data.source_code.match(
    payableFunctionPattern
  );
  const pureMatches = props.source.data.source_code.match(pureFunctionPattern);

  const privateCount = privateMatches ? privateMatches.length : 0;
  pureCount = pureMatches ? pureMatches.length : 0;
  return [
    internalCount,
    publicCount,
    pureCount,
    viewCount,
    payableCount,
    totalFunctions,
    privateCount,
  ];
};

const getFindingsData = async (findings) => {
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  findings.forEach((finding) => {
    if (finding.severity === "HIGH") {
      highCount++;
    } else if (finding.severity === "MEDIUM") {
      mediumCount++;
    } else if (finding.severity === "LOW") {
      lowCount++;
    }
  });
  return [highCount, mediumCount, lowCount];
};

const getGPTSummary = async (prompt) => {
  const params = (OpenAI.Chat.ChatCompletionCreateParams = {
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
  const completion = await openai.chat.completions.create(params);
  return completion.choices[0]?.message?.content;
};

async function createSummary(address) {
  const security = require("./cache/contracts/" + address + "/security.json");
  const functions = require("./cache/contracts/" + address + "/functions.json");
  const source = require("./cache/contracts/" + address + "/source.json");
  const findings = require("./cache/contracts/" + address + "/findings.json");

  const functionsData = await getFunctionsData({
    functions: functions,
    source: source,
  });
  const findingsData = await getFindingsData(findings);
  const parsedSecurity = security.data.result[address.toLowerCase()];

  const data = {
    token_name: parsedSecurity.token_name,
    token_symbol: parsedSecurity.token_symbol,
    is_honeypot: parsedSecurity.is_honeypot,
    blacklisted: parsedSecurity.is_blacklisted,
    external_functions: functionsData[1],
    internal_functions: functionsData[0],
    private_functions: functionsData[6],
    view_functions: functionsData[3],
    pure_functions: functionsData[2],
    payable_functions: functionsData[4],
    total_functions: functionsData[5],
    number_of_medium_severity_issues: findingsData[1],
    number_of_high_severity_issues: findingsData[0],
    number_of_low_severity_issues: findingsData[2],
    is_antiwhale: parsedSecurity.is_anti_whale,
    buy_tax: parsedSecurity.buy_tax,
    holder_count: parsedSecurity.holder_count,
    is_mintable: parsedSecurity.is_mintable,
    is_in_dex: parsedSecurity.is_in_dex,
    is_open_source: parsedSecurity.is_open_source,
    lp_holder_count: parsedSecurity.lp_holder_count,
    total_supply: parsedSecurity.total_supply,
    sell_tax: parsedSecurity.sell_tax,
  };

  const refineprompt = prompt.prompt + JSON.stringify(data);
  console.log(refineprompt);
  const summary = await getGPTSummary(refineprompt);

  return summary;
}

const getSummary = async (address) => {
  try {

    const cacheFile = path.join(
      __dirname,
      `./cache/contracts/${address}/summary.json`
    );

    await getCachedOrFreshData(cacheFile, createSummary, address);

    return true;
  } catch (error) {
    console.error("Error in getSummary:", error);
    return false;
  }
};
// createAuditSummery("0x514910771AF9Ca656af840dff83E8264EcF986CA")
module.exports = getSummary;
