const fs = require('fs');
const path = require('path');
const removeAnnotations = require('./preprocess');
const { runAudit } = require('./gpt_auditor');
const {run_critic} = require('./gpt_critic');
const { run_rank } = require('./gpt_rank');
const { getCachedOrFreshData } = require('../../utils');

// console.log(processed_source_code);

// runAudit(source_code, backend, temperature, topk, numAuditor)

async function generateAudit(source_code) {

    const processed_source_code = removeAnnotations(source_code);
    try {
        const bugInfoList = await runAudit(processed_source_code, 'gpt-4', 0.7, 3, 1);
        const criticBugInfoList = await run_critic(bugInfoList,'gpt-4', 0, 2);
        const rankBugInfoList = await run_rank(criticBugInfoList);
        console.log(rankBugInfoList);

        return rankBugInfoList;
        
    } catch (error) {
        console.error(error);
    }
}
async function get_Audit(address, source_code) {
    try {
      const cacheFile = path.join(
        __dirname,
        `../../cache/contracts/${address}/findings.json`
      );
  
      await getCachedOrFreshData(cacheFile, generateAudit, source_code);
  
      return true;
    } catch (error) {
      console.error("Error in getAudit:", error);
      return false;
    }
  }
  
  module.exports = get_Audit;
  


