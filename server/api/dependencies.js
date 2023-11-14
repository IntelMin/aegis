const express = require("express");
const axios = require("axios");
const router = express.Router();
const {fetchData} = require("../utils");
const { linearize } = require('c3-linearization');
const parser = require("@solidity-parser/parser");

router.get("/:address", async (req, res) => {
  // express.json();

  const address = req.params.address;

  console.log("dependency request: ", address);

  // const { address } = req.body;

  if (!address) {
    return res.status(400).send("No address provided");
  }

  let filename = `./contracts/${address}.json`;
  let url = `https://eth.blockscout.com/api/v2/smart-contracts/${address}`;

  let source_code = "";

  try {
    let filedata = await fetchData(filename, url);

    source_code = filedata["source_code"];

    let content = source_code;
    // console.log("content: ", content);
    let noColorOutput = false;

    const ast = (() => {
      try {
        return parser.parse(content, { loc: true });
      } catch (err) {
        console.error(
          `\nError found while parsing one of the provided files\n`
        );
        throw err;
      }
    })();

    console.log("Contract AST loaded");

    let contractName = null;
    const dependencies = {};

    parser.visit(ast, {
      ContractDefinition(node) {
        const contractName = node.name;
        dependencies[contractName] = node.baseContracts.map(spec =>
          spec.baseName.namePath
        );
      }
    });

    console.log("Dependencies loaded");

    console.log("Dependencies before linearization:", dependencies);
    
    let linearizedDependencies;
    try {
      linearizedDependencies = linearize(dependencies, { reverse: true });
    } catch (err) {
      console.error("Error during linearization:", err);
      return res.status(400).send(`Linearization error: ${err.message}`);
    }
    console.log("Dependencies linearized");
    
    // Create nodes and links for D3
    const nodes = Object.keys(linearizedDependencies).map(name => ({ id: name }));
    const links = [];

    console.log("Nodes and links created");
    
    Object.entries(linearizedDependencies).forEach(([contract, bases]) => {
      // For each base, create a link from the base to the contract
      bases.forEach(base => {
        if (base !== contract) { // Avoid self-references
          links.push({ source: base, target: contract });
        }
      });
    });

    console.log("Links created");
    
    // Combine nodes and links into a single object for JSON output
    const d3Data = { nodes, links };
    
    // Output the JSON
    // return JSON.stringify(d3Data);
    
    res.status(200).send(JSON.stringify(d3Data));
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = router;
