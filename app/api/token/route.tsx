import { request } from "http";
import { NextResponse } from "next/server";
const { AEGIS_SRV } = process.env;

type DataType =
  | "audit_request"
  | "audit_status"
  | "audit";
//   | "info"
//   | "stats"
//   | "code"
//   | "viz"
//   | "functions"
//   | "dependencies"
//   | "rugpull"
//   | "token_security";

type Handlers = {
  [key in DataType]: (address: string) => Promise<Response>;
};

async function fetchAuditStatus(address: string) {
  console.log("fetchAuditRequest");
  const url = `${AEGIS_SRV}/request/${address}`;
  return fetchAndRespond(url);
}

async function requestAudit(address: string) {
  console.log("requestAudit");
  const url = `${AEGIS_SRV}/request`;
  return fetchAndRespond(url, "POST", { address });
}

async function fetchAudit(address: string) {
  console.log("fetchAuditRequest");
  const url = `${AEGIS_SRV}/audit/${address}`;
  return fetchAndRespond(url);
}

async function fetchTokenInfo(address: string) {
  // console.log("fetchTokenInfo");
  // const url = `https://eth.blockscout.com/api/v2/tokens/${address}`;
  // // return fetchAndRespond(url);

  console.log("fetchTokenCode");
  // const url = `https://eth.blockscout.com/api/v2/smart-contracts/${address}`;
  const url = `${AEGIS_SRV}/info/${address}?_=${new Date().getTime()}`;

  return fetchAndRespond(url);
}

async function fetchTokenStats(address: string) {
  const url = `https://eth.blockscout.com/api/v2/tokens/${address}/stats`;
  return fetchAndRespond(url);
}

async function fetchTokenSecurity(address: string) {
  const url = `https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=${address}`;
  return fetchAndRespond(url);
}

async function fetchRugpull(address: string) {
  const url = `https://api.gopluslabs.io/api/v1/rugpull_detecting/1?contract_addresses=${address}`;
  return fetchAndRespond(url);
}

async function fetchTokenCode(address: string) {
  console.log("fetchTokenCode");
  // const url = `https://eth.blockscout.com/api/v2/smart-contracts/${address}`;
  const url = `${AEGIS_SRV}/audit/${address}`;

  return fetchAndRespond(url);
}

async function fetchTokenFunctions(address: string) {
  console.log("fetchTokenFunctions");
  // const url = `https://eth.blockscout.com/api/v2/smart-contracts/${address}`;
  const url = `${AEGIS_SRV}/markdown/${address}`;

  return fetchAndRespond(url);
}

async function fetchDependencies(address: string) {
  console.log("fetchDependencies");
  // const url = `https://eth.blockscout.com/api/v2/smart-contracts/${address}`;
  const url = `${AEGIS_SRV}/dependency/${address}`;

  return fetchAndRespond(url);
}

async function fetchTokenViz(address: string) {
  const url = `https://eth.blockscout.com/api/v2/tokens/${address}/viz`;
  return fetchAndRespond(url);
}

async function fetchAndRespond(
  url: string,
  method: string = "GET",
  body?: any
) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: method === "POST" && body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function POST(req: Request, res: NextResponse) {
  const data = await req.json();

  console.log(data);

  const handlers: Handlers = {
    audit_request: requestAudit,
    audit_status: fetchAuditStatus,
    audit: fetchAudit,
    // info: fetchTokenInfo,
    // stats: fetchTokenStats,
    // code: fetchTokenCode,
    // viz: fetchTokenViz,
    // functions: fetchTokenFunctions,
    // dependencies: fetchDependencies,
    // rugpull: fetchRugpull,
    // token_security: fetchTokenSecurity,
  };

  const handler = handlers[data.type as DataType];

  if (handler) {
    // Call the handler function and pass the address.
    return handler(data.address);
  } else {
    // Handle unknown type.
    return new Response(JSON.stringify({ error: "Unknown type" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
