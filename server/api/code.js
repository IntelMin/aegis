const express = require("express");
const axios = require("axios");
const router = express.Router();
const { fetchData, getCachedOrFreshData } = require("../utils");
const parser = require("@solidity-parser/parser");
const OpenAI = require("openai");
const path = require("path");

const openai = new OpenAI({
  apiKey: "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",
});

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

        If no vulnerabilities are found, return a json object with the following format:
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

function parseMarkdownToJSON(textArray) {
  // Join the array into a single string and split by headings
  const sections = textArray.join("\n\n").split("\n# ").slice(1); // slice(1) to skip the first empty element if the text starts with a heading
  const jsonResult = {};

  sections.forEach((section) => {
    // Split the section into lines and extract the heading
    const lines = section.trim().split("\n");
    const heading = lines[0].replace(/^[#]+ /, "").trim();
    // The rest of the lines are the content
    const content = lines.slice(1).join("\n").trim();

    // Add to the resulting object
    jsonResult[heading] = content;
  });

  return jsonResult;
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

router.get("/:address", async (req, res) => {
  const address = req.params.address;

  console.log("code request: ", address);

  if (!address) {
    return res.status(400).send("No address provided");
  }

  let filename = `./contracts/${address}.json`;
  let url = `https://eth.blockscout.com/api/v2/smart-contracts/${address}`;

  try {
    let filedata = await fetchData(filename, url);

    let source_code = filedata["source_code"];

    const treeCacheFile = path.join(__dirname, `../data/${address}/tree.json`);
    const findingsCacheFile = path.join(
      __dirname,
      `../data/${address}/findings.json`
    );

    let treeJson = await getCachedOrFreshData(
      treeCacheFile,
      generateTree,
      source_code
    );
    console.log("treeJson: ", treeJson);

    let codeSegments = parseSolidity(source_code);
    // console.log("codeSegments: ", codeSegments);

    let findings = await getCachedOrFreshData(
      findingsCacheFile,
      getFindings,
      codeSegments
    );
    // console.log("findings: ", findings);

    // let findingsJson = parseMarkdownToJSON(findings);

    // console.log(findingsJson);

    res.status(200).send({
      tree: treeJson,
      code: source_code,
      findings: findings,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = router;
