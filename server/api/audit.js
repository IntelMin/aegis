const express = require("express");
const axios = require("axios");
const {
  isERC20Token,
  insertRequestdb,
  fileExists,
  isContractOpenSource,
  readCache,
  supabase,
} = require("../utils");
const router = express.Router();
const path = require("path");

router.post("/", async (req, res) => {
  const { data: auditRequests, error } = await supabase
    .from("audit-requests")
    .select("address")
    .or("status.eq.pending,status.eq.partial");
  if (error) {
    return res.status(500).send("Error in fetching data from database");
  }

  const { address } = req.body;
  const filename = `./contracts/${address}.json`;

  if (fileExists(filename)) {
    return res.status(200).send("Contract already exists");
  }

  if (!isERC20Token(address)) {
    return res.status(200).send("Contract is not an ERC 20");
  }

  if (!isContractOpenSource(address)) {
    return res.status(200).send("Contract is not open source");
  }

  if (auditRequests.includes(address)) {
    return res
      .status(200)
      .send("Contract is in queue, please wait for the audit to finish");
  }

  insertRequestdb({ address: address, status: "pending" });

  return res.status(200).send("Contract added to audit queue");
});

router.get("/:address", async (req, res) => {
  const address = req.params.address;
  const { data: auditRequests, error } = await supabase
    .from("audit-requests")
    .select("*")
    .eq("address", address);
  if (auditRequests[0]?.status === "pending") {
    return res
      .status(200)
      .send("Contract is in queue, please wait for the audit to finish");
  }

  let filedata = readCache(`./contracts/${address}.json`);
  let source_code = filedata["source_code"];

  const securityCacheFile = path.join(
    __dirname,
    `../data/${address}/security.json`
  );
  const rugpullCacheFile = path.join(
    __dirname,
    `../data/${address}/rugpull.json`
  );
  const tokenCacheFile = path.join(
    __dirname,
    `../data/${address}/token.json`
  );
  const metadataCacheFile = path.join(
    __dirname,
    `../data/${address}/meta.json`
  );
  const treeCacheFile = path.join(__dirname, `../data/${address}/tree.json`);
  const statsCacheFile = path.join(
    __dirname,
    `../data/${address}/stats.json`
  );
  const findingsCacheFile = path.join(
    __dirname,
    `../data/${address}/findings.json`
  );
  const securityCache = await readCache(securityCacheFile);
  const rugpullCache = await readCache(rugpullCacheFile);
  const tokenCache = await readCache(tokenCacheFile);
  const metadataCache = await readCache(metadataCacheFile);
  const treeCache = await readCache(treeCacheFile);
  const statsCache = await readCache(statsCacheFile);
  const findingsCache = await readCache(findingsCacheFile);

  const solidity = filedata;
  delete solidity["abi"];
  delete solidity["creation_bytecode"];
  delete solidity["source_code"];
  delete solidity["deployed_bytecode"];
  delete solidity["decoded_constructor_args"];
  delete solidity["sourcify_repo_url"];

  const files = [];
  for (let i = 0; i < solidity["additional_sources"]?.length; i++) {
    files.push(solidity["additional_sources"][i]["file_path"]);
  }

  delete solidity["additional_sources"];

  if (auditRequests[0]?.status === "partial") {
    // return res.status(200).send("Contract is Partially complete , please wait for complete audit to finish");
    return res.status(200).send({
      tree: treeCache,
      code: source_code,
      findings: "pending",
      files: files,
      solidity: solidity,
      metadata: metadataCache,
      security: securityCache,
      rugpull: rugpullCache,
      token: tokenCache,
      stats: statsCache,
    });
  } else if (auditRequests[0]?.status === "complete") {
    // return res.status(200).send("Contract is complete");
    return res.status(200).send({
      tree: treeCache,
      code: source_code,
      findings: findingsCache,
      files: files,
      solidity: solidity,
      metadata: metadataCache,
      security: securityCache,
      rugpull: rugpullCache,
      token: tokenCache,
      stats: statsCache,
    });
  } else {
    return res.status(200).send("Contract is not in queue");
  }
});

module.exports = router;
