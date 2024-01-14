const express = require('express');
const axios = require('axios');
const router = express.Router();
const { readCache } = require('../lib/utils');
const getInfo = require('../modules/info');

router.get('/request/:address', async (req, res) => {
  const address = req.params.address;
  console.log('-- info request: ', address);

  const token_info = await getInfo(address);
  if (!token_info) {
    return res.status(404).json({ error: 'token not found' });
  } else {
    return res.status(200).json({ status: 'ok' });
  }
});

router.get('/meta/:address', async (req, res) => {
  const address = req.params.address;
  let filename = `./cache/contracts/${address}/meta.json`;
  console.log('-- meta fetch: ', filename);
  try {
    let filedata = await readCache(filename);

    let token_info = filedata.data.tokens;
    token_info = token_info[Object.keys(token_info)[0]];

    res.status(200).send(token_info);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'not found' });
  }
});

module.exports = router;
