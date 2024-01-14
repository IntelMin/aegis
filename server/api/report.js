// GET request to retrieve the status of a

const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const path = require('path');
const fs = require('fs');

router.get('/:address', async (req, res) => {
  const address = req.params.address;

  const { data: report, error } = await supabase
    .from('report_requests')
    .select('*')
    .eq('address', address);

  if (!report) {
    return res.status(404).json({
      error: 'No report request found.',
    });
  }
  console.log(report[0].status);
  if (report[0].status !== 'completed') {
    return res.status(200).json({
      data: 'Please wait, the report is processing.',
    });
  }

  const name = report[0].name;
  const filepath = path.join(
    __dirname,
    `../cache/reports/${address}/${name}.pdf`
  );
  console.log(filepath);
  // Check if the PDF file exists
  if (fs.existsSync(filepath)) {
    // Set the appropriate headers for the response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${path.basename(filepath)}`
    );

    // Stream the PDF file to the response
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
  } else {
    return res.status(404).json({ error: 'Report not found' });
  }
});

module.exports = router;
