import { NextRequest, NextResponse } from "next/server";
const { AEGIS_SRV } = process.env;

export async function GET(req: NextRequest) {
//   const url = `${AEGIS_SRV}/trending/new`;

  const cacheBuster = new Date().getTime();
  const url = `${AEGIS_SRV}/trending/top?_=${cacheBuster}`;

  console.log("url:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch data" });
  }
}
