const express = require("express");
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

const NEW_AUDIT_RETURN_CODE = {
  success: {
    code: 0,
    message: "Contract added to audit queue"
  },
  errorFetchingDb: {
    code: 1,
    message: "Error in fetching data from database"
  },
  alreadyExist: {
    code: 2,
    message: "Contract already exists"
  },
  notErc20: {
    code: 3,
    message: "Contract is not an ERC 20"
  },
  notOpenSource: {
    code: 4,
    message: "Contract is not open source"
  },
  requested: {
    code: 5,
    message: "Contract was already requested"
  },
}

router.post("/", async (req, res) => {
  const { address } = req.body;

  const { data: auditRequests, error } = await supabase
    .from("audit-requests")
    .select("address")
    .eq("address", address)

  if (error) {
    return res.status(500).send(NEW_AUDIT_RETURN_CODE.errorFetchingDb);
  }

  const filename = path.join(__dirname, `./contracts/${address}.json`).toString();

  if (fileExists(filename)) {
    return res.status(404).send(NEW_AUDIT_RETURN_CODE.alreadyExist);
  }

  if (!isERC20Token(address)) {
    return res.status(404).send(NEW_AUDIT_RETURN_CODE.notErc20);
  }

  if (!isContractOpenSource(address)) {
    return res.status(404).send(NEW_AUDIT_RETURN_CODE.notOpenSource);
  }

  if (auditRequests.length) {
    return res
      .status(404)
      .send(NEW_AUDIT_RETURN_CODE.requested);
  }

  insertRequestdb({ address: address, status: "pending" });

  return res.status(200).send(NEW_AUDIT_RETURN_CODE.success);
});

const AUDIT_STATUS_RETURN_CODE = {
  pending: 0,
  partial: 1,
  complete: 2,
  errorFetchingDb: 3
}

router.get("/:address", async (req, res) => {
  const address = req.params.address;
  const { data: auditRequests, error } = await supabase
    .from("audit-requests")
    .select("*")
    .eq("address", address);

  if (error) {
    return res.status(500).send({
      status: AUDIT_STATUS_RETURN_CODE.errorFetchingDb,
      message: 'Error in fetching data from database'
    })
  }

  if (auditRequests[0]?.status === "pending") {
    return res.status(200).send({
      status: AUDIT_STATUS_RETURN_CODE.pending
    });
  }

  let filedata = readCache(path.join(__dirname, `./contracts/${address}.json`));
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
      status: AUDIT_STATUS_RETURN_CODE.partial,
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
  }

  if (auditRequests[0]?.status === "complete") {
    // return res.status(200).send("Contract is complete");
    return res.status(200).send({
      status: AUDIT_STATUS_RETURN_CODE.complete,
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
  }
});

module.exports = router;
