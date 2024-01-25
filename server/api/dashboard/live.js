const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const axios = require('axios');
const { readCache, writeCache } = require('../../lib/file');
const { fetchLatestPairs } = require('../../lib/third-party/defined');

async function getLivePairs() {
  console.log('Getting live pairs');

  const variables = {
    limit: 40,
    networkFilter: [1],
  };

  const data = await fetchLatestPairs(variables);
  if (data) {
    let filename = `./cache/trending/live.json`;
    await writeCache(filename, data.data.getLatestPairs.items);
  }
}

router.get('/live', async (req, res) => {
  let filename = `./cache/trending/live.json`;
  let filedata = await readCache(filename);
  res.status(200).send(filedata);
});

async function init() {
  await getLivePairs();

  console.log(`Dashboard: live fetch cron to run every minute`);
  cron.schedule('*/1 * * * *', () => {
    getLivePairs();
  });
}

module.exports = { router, init };
