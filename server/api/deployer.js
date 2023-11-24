const express = require('express');
const main = require('../codes/main');
const dependencies = require('../codes/dependencies');
const solc = require('solc');

const router = express.Router();

const getStatus = (code) => {
  return {
    name: 'ABC',
    symbol: 'SYM',
    supply: 10000
  }
}

router.post('/compile', (req, res) => {
  const input = {
    language: 'Solidity',
    sources: {
      'ABC.sol': {
        content: dependencies.concat(JSON.parse(req.body.code))
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  res.status(200).json({ bytecode: output.contracts['ABC.sol'].ABC.evm.bytecode.object })
});

router.get('/code', (req, res) => {
  res.status(200).json({
    code: main,
    status: getStatus(main)
  })
});

module.exports = router;