const express = require('express');
const code = require('../constants/code');
const dependencies = require('../constants/dependencies');
const solc = require('solc');

const router = express.Router();

router.post('/compile', (req, res) => {
  const input = {
    language: 'Solidity',
    sources: {
      'ABC.sol': {
        content: dependencies.concat(req.body.code)
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
  res.status(200).json({ code })
});

module.exports = router;