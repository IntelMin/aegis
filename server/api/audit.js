const express = require("express");
const axios = require("axios");
const { isERC20Token, isContractOpenSource } = require("../utils");
const router = express.Router();

router.post("/:address", async (req, res) => {
  const { data: auditRequests, error } = await supabase
    .from("audit-requests")
    .select("*");
  audit_queue = auditRequests.map((auditRequest) => auditRequest.address);
  const address = req.params.address;
  if (!fileExists(filename)) {
      if (isERC20Token(address)) {
      if (isContractOpenSource(address)) {
        if (!audit_queue.includes(address)) {
          audit_queue.push(address);
          insertRequestdb({ address: address, status: "pending" });
        } else {
            return res
            .status(200)
            .send(
                "Contract is already in queue, please wait for the audit to finish"
                );
            }
        } else {
            return res.status(200).send("Contract is not open source");
        }
    } else {
        return res.status(200).send("Contract is not an ERC 20");
    }
}
});
router.get("/:address", async (req, res) => {
    const address = req.params.address;
    const {data: auditRequests, error} = await supabase.from('audit-requests').select('*').eq('address', address);
    if(auditRequests[0].status ==="pending"){
        return res.status(200).send("Contract is in queue, please wait for the audit to finish");
    }
    else if(auditRequests[0].status ==="partial"){
        return res.status(200).send("Contract is Partially complete , please wait for complete audit to finish");
    } else if(auditRequests[0].status ==="complete"){

        return res.status(200).send("Contract is complete");
    }
    else{
        return res.status(200).send("Contract is not in queue");
    }
});
module.exports = router;
