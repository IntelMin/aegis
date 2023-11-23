const express = require("express");
const router = express.Router();
const parser = require("@solidity-parser/parser");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "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",
});

async function callOpenAI(query) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `${defaultPrompt}\n${query}` }],
  });

  const trueResponse = JSON.parse(
    String(response.choices[0].message.content)
      .replace(/\n/g, "")
      .replace(/   /g, "")
      .replace(/ /g, "")
  );
  return trueResponse;
}

function validateString(input) {
  const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const startsWithNumberRegex = /^\d/;
  const keywords = [
    "address",
    "bool",
    "string",
    "int",
    "uint",
    "byte",
    "bytes",
    "wei",
    "gwei",
    "szabo",
    "finney",
    "ether",
    "pure",
    "view",
    "payable",
    "constant",
    "anonymous",
    "indexed",
    "if",
    "else",
    "for",
    "while",
    "break",
    "continue",
    "return",
    "throw",
    "function",
    "returns",
    "constructor",
    "contract",
    "library",
    "interface",
    "event",
    "msg",
    "block",
    "tx",
    "now",
    "suicide",
    "selfdestruct",
    "require",
    "revert",
    "assert",
    "addmod",
    "mulmod",
    "keccak256",
    "sha256",
    "sha3",
    "ripemd160",
    "storage",
    "memory",
    "calldata",
    "this",
    "super",
    "enum",
    "mapping",
    "struct",
    "var",
  ];

  return (
    specialCharsRegex.test(input) |
    startsWithNumberRegex.test(input) |
    keywords.includes(input) |
    input.includes(" ")
  );
}

function updateCode(code, prompt) {
  try {
    let newCode = code;
    const { nameRegex, symbolRegex, supplyRegex, buyTaxRegex, sellTaxRegex } =
      regex();
    for (const [key, val] of Object.entries(prompt)) {
      switch (key) {
        case "name":
          if (!validateString(val)) {
            newCode = newCode.replace(
              nameRegex,
              `string private constant _name = "${val}";`
            );
          }
          break;

        case "symbol":
          newCode = newCode.replace(
            symbolRegex,
            `string private constant _symbol = "${val}";`
          );
          break;

        case "supply":
          newCode = newCode.replace(
            supplyRegex,
            `uint256 private constant _tTotal = ${val} * 10**9;`
          );
          break;

        case "buy_tax":
          newCode = newCode.replace(
            buyTaxRegex,
            `uint256 private _taxFeeOnBuy = ${val};`
          );
          break;

        case "sell_tax":
          newCode = newCode.replace(
            sellTaxRegex,
            `uint256 private _taxFeeOnSell = ${val};`
          );
          break;

        default:
          break;
      }
    }
    return JSON.stringify(newCode);
  } catch (e) {
    if (e instanceof parser.ParserError) {
      console.error("Parse error: ", e.errors);
    }
    console.error("Update code Error: ", e);
  }
}

router.post("/", async (req, res) => {
  if (req.body === undefined) res.status(400).send("Bad request");

  const { prompt, code } = req.body;

  if (!prompt || !code) {
    res.status(400).send("Bad request");
  }

  try {
    const response = await callOpenAI(prompt);
    const newCode = updateCode(code, response);
    res.status(200).send(newCode);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = router;

const defaultPrompt = `
Given the following request, return key / val formatted json string like
{ [key]: [val] }
'key' is what user wants to update, 'val' is target value.
---------------------------------------
`;

/* 
 const ast = parser.parse(code, { loc: true });
    ast.children.forEach((child) => {
      if (child.type === "ContractDefinition") {
        child.subNodes.forEach((base) => {
          if (base.type === "StateVariableDeclaration") {
            for (const [key, val] of Object.entries(prompt)) {
              switch (key) {
                case "name":
                  if (
                    !validateString(val) &&
                    base.variables[0].name === "_name"
                  ) {
                    base.initialValue.value = val;
                    base.variables[0].expression.value = val;
                  }
                  break;

                case "symbol":
                  if (base.variables[0].name === "_symbol") {
                    base.initialValue.value = val;
                    base.variables[0].expression.value = val;
                  }
                  break;

                case "supply":
                  if (base.variables[0].name === "_tTotal") {
                    base.initialValue.left.number = val;
                    base.variables[0].expression.left.number = val;
                  }
                  break;

                case "buy_tax":
                  if (base.variables[0].name === "_taxFeeOnBuy") {
                    base.initialValue.number = val;
                    base.variables[0].expression.number = val;
                  }
                  break;

                case "sell_tax":
                  if (base.variables[0].name === "_taxFeeOnSell") {
                    base.initialValue.number = val;
                    base.variables[0].expression.number = val;
                  }
                  break;

                default:
                  break;
              }
            }
          }
        });
      }
    });
    return JSON.stringify(ast);
*/

function regex() {
  const nameRegex = /string private constant _name\s*=\s*"(.*?)";/;
  const symbolRegex = /string private constant _symbol\s*=\s*"(.*?)";/;
  const supplyRegex =
    /uint256 private constant _tTotal\s*=\s*(\d+)\s*\*\s*10\*\*9\s*;/;
  const buyTaxRegex = /uint256 private _taxFeeOnBuy\s*=\s*(\d+)\s*;/;
  const sellTaxRegex = /uint256 private _taxFeeOnSell\s*=\s*(\d+)\s*;/;
  return {
    nameRegex,
    symbolRegex,
    supplyRegex,
    buyTaxRegex,
    sellTaxRegex,
  };
}
