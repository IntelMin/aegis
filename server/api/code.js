const express = require("express");
const axios = require("axios");
const router = express.Router();
const {
  fetchData,
  getCachedOrFreshData,
  fileExists,
  insertRequestdb,
  isContractOpenSource,
  supabase,
  modifyRequestdb,
  getCachedData,
} = require("../utils");
const parser = require("@solidity-parser/parser");
const path = require("path");

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

router.get("/:address", async (req, res) => {
  const { data: auditRequests, error } = await supabase
    .from("audit-requests")
    .select("*");

  const audit_queue = auditRequests.map((auditRequest) => auditRequest.address);
  const address = req.params.address;

  console.log("code request: ", address);

  if (!address) {
    return res.status(400).send("No address provided");
  }
  let filename = `./contracts/${address}.json`;
  // move to worker

  if (!fileExists(filename)) {
    if (!isContractOpenSource(address)) {
      return res.status(200).send("Contract is not open source");
    }

    if (audit_queue.includes(address)) {
      return res
        .status(200)
        .send(
          "Contract is already in queue, please wait for the audit to finish"
        );
    }

    console.log("Contract is open source, adding to queue");

    insertRequestdb({ address, status: "pending" });
  }

  let url = `https://eth.blockscout.com/api/v2/smart-contracts/${address}`;

  try {
    let filedata = await fetchData(filename, url);

    let source_code = filedata["source_code"];

    const treeCacheFile = path.join(__dirname, `../data/${address}/tree.json`);
    console.log("treeCacheFile: ", treeCacheFile);
    let treeJson = await getCachedOrFreshData(
      treeCacheFile,
      generateTree,
      source_code
    );
    if (treeJson) {
      modifyRequestdb(address, "partial");
      console.log("Partial audit completed");
    }
    const findingsCacheFile = path.join(
      __dirname,
      `../data/${address}/findings.json`
    );
    let findings = await getCachedData(findingsCacheFile);

    const solidity = filedata;
    delete solidity["abi"];
    delete solidity["creation_bytecode"];
    delete solidity["source_code"];
    delete solidity["deployed_bytecode"];
    delete solidity["decoded_constructor_args"];
    delete solidity["sourcify_repo_url"];

    const files = [];
    for (let i = 0; i < solidity["additional_sources"].length; i++) {
      files.push(solidity["additional_sources"][i]["file_path"]);
    }

    delete solidity["additional_sources"];

    res.status(200).send({
      tree: treeJson,
      code: source_code,
      findings: findings,
      files: files,
      solidity: solidity,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = router;
