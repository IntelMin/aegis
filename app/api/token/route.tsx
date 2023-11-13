import { NextResponse } from "next/server";
import { parse, visit, ParserError } from '@solidity-parser/parser';

type DataType = "info" | "stats" | "code" | "viz" | "functions" | "dependencies";

type Handlers = {
  [key in DataType]: (address: string) => Promise<Response>;
};

async function fetchTokenInfo(address: string) {
  console.log("fetchTokenInfo");
  const url = `https://eth.blockscout.com/api/v2/tokens/${address}`;
  return fetchAndRespond(url);
}

async function fetchTokenStats(address: string) {
  const url = `https://eth.blockscout.com/api/v2/tokens/${address}/stats`;
  return fetchAndRespond(url);
}

async function fetchTokenCode(address: string) {
  console.log("fetchTokenCode");
  // const url = `https://eth.blockscout.com/api/v2/smart-contracts/${address}`;
  const url = `http://localhost:9898/describe/${address}`;

  return fetchAndRespond(url);
}

async function fetchTokenFunctions(address: string) {
  console.log("fetchTokenFunctions");
  // const url = `https://eth.blockscout.com/api/v2/smart-contracts/${address}`;
  const url = `http://localhost:9898/markdown/${address}`;

  return fetchAndRespond(url);
}

async function fetchDependencies(address: string) {
  console.log("fetchDependencies");
  // const url = `https://eth.blockscout.com/api/v2/smart-contracts/${address}`;
  const url = `http://localhost:9898/dependency/${address}`;

  return fetchAndRespond(url);
}

async function fetchTokenViz(address: string) {
  const url = `https://eth.blockscout.com/api/v2/tokens/${address}/viz`;
  return fetchAndRespond(url);
}

// Common function to perform the fetch and return a response.
async function fetchAndRespond(url: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
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
    info: fetchTokenInfo,
    stats: fetchTokenStats,
    code: fetchTokenCode,
    viz: fetchTokenViz,
    functions: fetchTokenFunctions,
    dependencies: fetchDependencies,
  };

  // Get the handler function based on the data type.
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
