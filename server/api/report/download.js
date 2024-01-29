const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const supabase = require('../../lib/supabase');

router.get('/download/:address', async (req, res) => {
  const address = req.params.address;

  console.log('download report: ', address);

  try {
    const { data: reportRequests, error: error_report } = await supabase
      .from('report_requests')
      .select('*')
      .eq('address', address);

    console.log(reportRequests);
    console.log(error_report);

    const reportRequest = reportRequests[0];

    const token_name = reportRequest.name;

    const filePath = `./cache/reports/${address}/${token_name}.pdf`;

    const fileData = await fs.readFile(filePath);

    const base64Data = Buffer.from(fileData).toString('base64');

    res.send({ report: base64Data, name: token_name });
  } catch (error) {
    console.error('Error fetching report:', error);
    if (error.code === 'ENOENT') {
      return res.status(404).send('Report not found');
    }
    res.status(500).send('Error');
  }
});

module.exports = router;
