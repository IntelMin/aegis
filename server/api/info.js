const express = require('express');
const axios = require('axios');
const router = express.Router();
const { readCache } = require('../lib/utils');
const getInfo = require('../modules/info');

router.get('/request/:address', async (req, res) => {
  const address = req.params.address;
  console.log('-- info request: ', address);

  //   let directory = `./cache/contracts/${address}`;
  //   let files = {
  //     info: `${directory}/info.json`,
  //     meta: `${directory}/meta.json`,
  //     rugpull: `${directory}/rugpull.json`,
  //     security: `${directory}/security.json`,
  //     source: `${directory}/source.json`,
  //   };

  //   let info_exists = false;
  //   let token_info;
  //   if (fs.existsSync(directory)) {
  //     info_exists = true;
  //     for (const key of Object.keys(files)) {
  //       if (!fs.existsSync(files[key])) {
  //         info_exists = false;
  //         break;
  //       }
  //     }
  //   }

  //   if (!info_exists) {
  //     console.log('info not found, fetching');
  //     token_info = getInfo(address);
  //   } else {
  //   }

  let token_info = await getInfo(address);

  if (!token_info) {
    return res.status(404).json({ error: 'token not found' });
  } else {
    return res.status(200).json({ status: 'ok' });
  }
});

router.get('/:type/:address', async (req, res) => {
  const address = req.params.address;
  const info_type = req.params.type;

  let filename = `./cache/contracts/${address}/${info_type}.json`;

  console.log(`-- info fetch: ${info_type} ${address}`);

  try {
    let filedata = await readCache(filename);

    let token_info;
    if (info_type === 'meta') {
      token_info = filedata.data.tokens;
      token_info = token_info[Object.keys(token_info)[0]];
    } else {
      token_info = filedata;
    }

    res.status(200).send(token_info);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'not found' });
  }
});

module.exports = router;
