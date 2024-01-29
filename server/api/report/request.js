const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const supabase = require('../../lib/supabase');

router.get('/request/:address/:user_id', async (req, res) => {
  const address = req.params.address;
  const user_id = req.params.user_id;

  const [whitelistedUsersResponse, auditRequestsResponse] = await Promise.all([
    supabase.from('aegis').select('*').eq('user_id', user_id),
    supabase
      .from('audit_requests')
      .select('*')
      .eq('contract', address)
      .eq('status', 'completed'),
  ]);

  const { data: whitelisted_users, error: error_whitelist } =
    whitelistedUsersResponse;
  const { data: auditRequests, error: error_req } = auditRequestsResponse;
  if (error_whitelist) {
    throw new Error(error_whitelist.message);
  }
  if (error_req) {
    throw new Error(error_req.message);
  }
  if (whitelisted_users.length === 0) {
    return res.status(403).send('Forbidden');
  }
  if (!whitelisted_users[0].whitelisted) {
    return res.status(403).send('Forbidden');
  }
  if (auditRequests.length === 0) {
    return res.status(404).send('Not found');
  }
  const { data: reportRequests, error: error_report } = await supabase
    .from('report_requests')
    .select('*')
    .eq('address', address);
  if (error_report) {
    throw new Error(error_report.message);
  }

  if (reportRequests.length === 0) {
    const { data: reportRequests, error: error_report } = await supabase
      .from('report_requests')
      .insert([{ address: address, status: 'requested', user_id: user_id }]);
    if (error_report) {
      throw new Error(error_report.message);
    }
    return res.status(200).send('Report requested');
  } else {
    return res.status(200).send(reportRequests[0].link);
  }
});
module.exports = router;
