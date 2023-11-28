const { fetchData, getCachedOrFreshData, supabase, modifyRequestdb } = require("./utils");
const OpenAI = require("openai");
const async = require("async");
const path = require("path");

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
  //GPT code audit part 
async function worker() {
    const { data: auditPartialRequests, error } = await supabase
    .from('audit-requests')
    .select('*')
    .eq('status', 'partial');

    const { data: auditPendingRequests, error:error_pending } = await supabase
    .from('audit-requests')
    .select('*')
    .eq('status', 'pending');
    
    async.eachSeries(auditPartialRequests, async (address) => {
        await gptauditor(address.address)
        modifyRequestdb(address.address,"complete")
    }, (error) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('All audits completed.');
      }
    });
    async.eachSeries(auditPendingRequests, async (address) => {
      try {
        const token_info = await fetchAndCacheData(
          "info",
          `https://eth.blockscout.com/api/v2/tokens/${address}`,
          address
        );
    
        const token_stats = await fetchAndCacheData("stats", `https://eth.blockscout.com/api/v2/tokens/${address}/stats`, address);
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
      }
      catch(e){
        console.log(e)
      }

        modifyRequestdb(address.address,"partial")
    }, (error) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Partial audits completed.');
      }
    });
  }
  module.exports = worker;