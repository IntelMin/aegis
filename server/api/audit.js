const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/:address", async (req, res) => {
    const { data: auditRequests, error } = await supabase
    .from('audit-requests')
    .select('*')
    audit_queue = auditRequests.map((auditRequest) => auditRequest.address)
    const address = req.params.address;


});