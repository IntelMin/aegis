import { NextRequest, NextResponse } from "next/server";
const { AEGIS_SRV } = process.env;

export async function GET(req: NextRequest) {

  const url = `${AEGIS_SRV}/bugbounty/`;

  console.log("url:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
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
