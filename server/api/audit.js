const express = require("express");
const {
  isERC20Token,
  insertRequestdb,
  fileExists,
  isContractOpenSource,
  readCache,
} = require("../utils");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// TODO: Remove this
if (!fs.existsSync(path.join(__dirname, "../data"))) {
  fs.mkdirSync(path.join(__dirname, "../data"));
}

if (!fs.existsSync(path.join(__dirname, "../contracts"))) {
  fs.mkdirSync(path.join(__dirname, "../contracts"));
}

router.get("/:address", async (req, res) => {
  const address = req.params.address;

  let filedata = await readCache(
    path.join(__dirname, `../contracts/${address}.json`)
  );
  let source_code = filedata?.["source_code"];

  const securityCacheFile = path.join(
    __dirname,
    `../data/${address}/security.json`
  );
  const rugpullCacheFile = path.join(
    __dirname,
    `../data/${address}/rugpull.json`
  );
  const tokenCacheFile = path.join(__dirname, `../data/${address}/info.json`);
  const metadataCacheFile = path.join(
    __dirname,
    `../data/${address}/meta.json`
  );
  const treeCacheFile = path.join(__dirname, `../data/${address}/tree.json`);
  const statsCacheFile = path.join(__dirname, `../data/${address}/stats.json`);
  const findingsCacheFile = path.join(
    __dirname,
    `../data/${address}/findings.json`
  );
  const securityCache = await readCache(securityCacheFile);
  const rugpullCache = await readCache(rugpullCacheFile);
  const tokenCache = await readCache(tokenCacheFile); // TODO: Fetch & cache, this is realtime data (can be cached upto 1min)
  const metadataCache = await readCache(metadataCacheFile);
  const treeCache = await readCache(treeCacheFile);
  const statsCache = await readCache(statsCacheFile); // ???? Not used
  const findingsCache = await readCache(findingsCacheFile);

  const files = [];
  const solidity = filedata;

  if (solidity) {
    delete solidity["abi"];
    delete solidity["creation_bytecode"];
    delete solidity["source_code"];
    delete solidity["deployed_bytecode"];
    delete solidity["decoded_constructor_args"];
    delete solidity["sourcify_repo_url"];

    for (let i = 0; i < solidity["additional_sources"]?.length; i++) {
      files.push(solidity["additional_sources"][i]["file_path"]);
    }

    delete solidity["additional_sources"];
  }

  let parse_meta = metadataCache["tokens"][0];
  let parse_token = tokenCache["data"];
  let parse_rugpull = rugpullCache["data"]["result"];
  let parse_security = securityCache["data"]["result"];
  parse_security = parse_security[Object.keys(parse_security)[0]];

  try {
    return res.status(200).send({
      tree: treeCache,
      code: source_code,
      findings: findingsCache,
      files: files,
      solidity: solidity,
      metadata: parse_meta,
      security: parse_security,
      rugpull: parse_rugpull,
      token: parse_token,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
