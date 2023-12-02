const { readCache, supabase, modifyRequestdb } = require("./utils");
const path = require("path");
const getInfo = require("./modules/info");
const getTree = require("./modules/tree");
const getDependencies = require("./modules/dependencies");
const getFunctions = require("./modules/functions");
const getAudit = require("./modules/audit");

//GPT code audit part
async function worker() {
  const { data: auditRequests, error: error_req } = await supabase
    .from("audit_requests")
    .select("*")
    .or("status.eq.pending,status.eq.partial");

  for (const row of auditRequests) {
    const address = row.contract;
    let source_code = "";

    console.log("Processing: ", address, row.status);

    try {
      if (row.status === "pending") {
        // generate token, meta, security & rugpull json
        const token_info = await getInfo(address);
        if (!token_info) {
          throw new Error("Token info not returned from API");
        }
        console.log("-- token, meta, security & rugpull");

        // get source file content
        const source_file = path
          .join(__dirname, `./cache/contracts/${address}/source.json`)
          .toString();
        source_code = await readCache(source_file);
        source_code = source_code["data"]["source_code"];

        // generate tree.json
        const tree = await getTree(address, source_code);
        if (!tree) {
          throw new Error("Tree not generated");
        }
        console.log("-- tree.json");

        // generate dependencies.json
        const dependencies = await getDependencies(address, source_code);
        if (!dependencies) {
          throw new Error("Dependencies not generated");
        }
        console.log("-- dependencies.json");

        // generate functions.json
        const functions = await getFunctions(address, source_code);
        if (!functions) {
          throw new Error("Functions not generated");
        }
        console.log("-- functions.json");

        modifyRequestdb(address, "partial");
        console.log("-- modified status to partial");
      }

      if (row.status === "partial") {

        // get source file content
        const source_file = path
          .join(__dirname, `./cache/contracts/${address}/source.json`)
          .toString();
        source_code = await readCache(source_file);
        source_code = source_code["data"]["source_code"];

        // generate findings.json
        start_time = new Date().getTime();
        console.log("-- start findings.json");
        const findings = await getAudit(address, source_code);
        if (!findings) {
          throw new Error("Findings not generated");
        }
        end_time = new Date().getTime();
        console.log("-- findings.json");
        console.log("Time taken: ", end_time - start_time, "ms");

        modifyRequestdb(address, "completed");
        console.log("-- modified status to completed");
      }
    } catch (e) {
      // TODO: Add failure to supabase
      console.log(e);
    }
  }
}
// module.exports = worker;

const runWorker = async () => {
  while (true) {
    await worker();
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

runWorker();

module.exports = runWorker;
