// GET request to retrieve the status of a report
router.get('/:address', async (req, res) => {
  const address = req.params.address;

  const { data: report, error } = await supabase
    .from('report_request')
    .select('*')
    .eq('address', address);

  if (!report) {
    return res.status(404).json({
      error: 'No report request found.',
    });
  }

  if (report.status != 'completed') {
    return res.status(200).json({
      data: 'Please wait, the report is processing.',
    });
  }

  const name = report.name;
  const filepath = path.join(`./cache/report/${address}/${name}.pdf`);

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
