const express = require('express');
const {
  isERC20Token,
  insertRequestdb,
  fileExists,
  isContractOpenSource,
  readCache,
  supabase,
} = require('../../lib/utils');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const {
  NEW_AUDIT_RETURN_CODE,
  AUDIT_STATUS_RETURN_CODE,
} = require('./statusCodes');
const supabase = require('../../supabase');

async function getAuditRequest(address) {
  const { data, error } = await supabase
    .from('audit_requests')
    .select('*')
    .eq('contract', address);
  console.log(error);
  console.log({ data });

  return { data, error };
}

function getProgress(address) {
  const files = [
    'info.json',
    'meta.json',
    'rugpull.json',
    'security.json',
    'source.json',
    'functions.json',
    'dependencies.json',
    'tree.json',
    'stats.json',
    'findings.json',
  ];

  let filesExist = 0;

  const basePath = path.join('./cache/contracts', address);

  files.forEach(file => {
    const filePath = path.join(basePath, file);

    if (fs.existsSync(filePath)) {
      filesExist++;
    }
  });

  const progressPercentage = (filesExist / files.length) * 100;

  return progressPercentage;
}

function getEta(address) {
  let eta = 3 * 60;

  const basePath = path.join('./cache/contracts', address);
  const filePath = path.join(basePath, 'source.json');

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    const source_code = json['data']['source_code'];
    const lines = source_code.split(/\r?\n/);
    let sourceJsonLineCount = lines.length;

    if (sourceJsonLineCount > 0) {
      eta = Math.round((sourceJsonLineCount / 300) * 60);
    }
  } else {
    console.log("source.json doesn't exist");
  }

  return eta;
}

router.get('/status/:address', async (req, res) => {
  const address = req.params.address;

  console.log('audit status: ', address);

  const { data: auditRequests, error } = await getAuditRequest(address);
  if (error) {
    console.log(error);
    return res.status(500).send({
      status: AUDIT_STATUS_RETURN_CODE.errorFetchingDb,
      message: 'Error in fetching data from database',
    });
  }

  //   console.log(auditRequests);

  let statusResponse;

  if (auditRequests.length === 0) {
    statusResponse = AUDIT_STATUS_RETURN_CODE.notRequested;
  } else {
    switch (auditRequests[0].status) {
      case 'pending':
        statusResponse = AUDIT_STATUS_RETURN_CODE.pending;
        break;

      case 'partial':
        statusResponse = AUDIT_STATUS_RETURN_CODE.partial;
        break;

      case 'completed':
        statusResponse = AUDIT_STATUS_RETURN_CODE.complete;
        break;

      default:
        statusResponse = AUDIT_STATUS_RETURN_CODE.notRequested;
    }
  }

  return res.status(200).send({
    status: statusResponse,
    progress: getProgress(address),
    eta: getEta(address),
  });
});

module.exports = router;
