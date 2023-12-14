const { report } = require("process");
const supabase = require("../../supabase");
const { generatePDF } = require("./generate");
const fs = require('fs');
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  
  const owner = 'AslamSDM';
  const repo = 'test-repo';

  
async function modifyreportRequestdb(address, status,link) {
    try {
        const { data, error } = await supabase.from('report-requests').update({ status,link }).eq('address', address);
        if (error) {
        throw new Error(error.message);
        }
        return data;
    } catch (error) {
        console.error('Error updating data in Supabase:', error);
        return [];
    }
}
// Fetch data from Supabase table
async function fetchDataFromTable() {
  try {
    const { data, error } = await supabase.from('report-requests').select('*').eq('status', 'requested');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    return [];
  }
}
async function pushToGithub(address) {
    try {
        const file = fs.readFileSync(`./${address}.pdf`);
        const content = file.toString('base64');
        const response = await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: `reports/${address}.pdf`,
            message: `Add report for ${address}`,
            content,
        });

        console.log(response);
        return response.data.url
    } catch (error) {
        console.error("Error while pushing to GitHub:", error);
    }
}
async function reportWorker() {
    const requests = await fetchDataFromTable()
    if (requests?.length === 0) {
        console.log("No requests found");
        return;
    }
    for (const row of requests) {
        const address = row.address;
        console.log("Processing: ", address, row.status);

        try {
            if (row.status === "requested") {
                await generatePDF(address);
                console.log("-- generated pdf");
                const link = await pushToGithub(address);
                console.log("-- pushed to github");
                await modifyreportRequestdb(address, "completed", link);
                console.log("-- pushed to supabase");
            }
        } catch (error) {
            console.error("Error while processing: ", address, error);
            modifyRequestdb(address, "failed");
            console.log("-- modified status to failed");
        }
    }
}
const runReportWorker = async () => {
    while (true) {
      await reportWorker();      ;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  };
runReportWorker();