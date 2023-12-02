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
const fs = require("fs");

const {
  NEW_AUDIT_RETURN_CODE,
  AUDIT_STATUS_RETURN_CODE,
} = require("./statusCodes");
const { get } = require("http");

async function getAuditRequest(address) {
  const { data, error } = await supabase
    .from("audit_requests")
    .select("*")
    .eq("contract", address);

  return { data, error };
}

router.get("/:address", async (req, res) => {
  const address = req.params.address;

  console.log("audit status: ", address);

  const { data: auditRequests, error } = await getAuditRequest(address);
  if (error) {
    console.log(error);
    return res.status(500).send({
      status: AUDIT_STATUS_RETURN_CODE.errorFetchingDb,
      message: "Error in fetching data from database",
    });
  }

  console.log(auditRequests);

  if (auditRequests.length === 0) {
    return res.status(200).send({
      status: AUDIT_STATUS_RETURN_CODE.notRequested,
    });
  }

  if (auditRequests[0]?.status === "pending") {
    return res.status(200).send({
      status: AUDIT_STATUS_RETURN_CODE.pending,
    });
  }

  if (auditRequests[0]?.status === "partial") {
    return res.status(200).send({
      status: AUDIT_STATUS_RETURN_CODE.partial,
    });
  }

  if (auditRequests[0]?.status === "completed") {
    return res.status(200).send({
      status: AUDIT_STATUS_RETURN_CODE.complete,
    });
  }
});

const processingContracts = new Set();

router.post("/", async (req, res) => {
  const { address } = req.body;
  console.log("audit request: ", address);

  const { data: auditRequests, error } = await supabase
    .from("audit_requests")
    .select("contract")
    .eq("contract", address);

  if (error) {
    return res.status(500).send(NEW_AUDIT_RETURN_CODE.errorFetchingDb);
  }

  if (auditRequests.length) {
    return res.status(404).send(NEW_AUDIT_RETURN_CODE.requested);
  }

  const filename = path
    .join(__dirname, `./cache/contracts/${address}/source.json`)
    .toString();

  if (fileExists(filename)) {
    return res.status(404).send(NEW_AUDIT_RETURN_CODE.alreadyExist);
  }

  const [isErc20, isOpenSrc] = await Promise.all([
    isERC20Token(address),
    isContractOpenSource(address),
  ]);

  if (!isErc20) {
    return res.status(404).send(NEW_AUDIT_RETURN_CODE.notErc20);
  }

  if (!isOpenSrc) {
    return res.status(404).send(NEW_AUDIT_RETURN_CODE.notOpenSource);
  }

  if (processingContracts.has(address)) {
    return res.status(404).send(NEW_AUDIT_RETURN_CODE.requested);
  }

  processingContracts.add(address);

  try {
    await insertRequestdb({ contract: address, status: "pending" });
    return res.status(200).send(NEW_AUDIT_RETURN_CODE.success);
  } catch (error) {
    return res.status(500).send(NEW_AUDIT_RETURN_CODE.errorFetchingDb);
  } finally {
    processingContracts.delete(address);
  }

});

module.exports = router;
