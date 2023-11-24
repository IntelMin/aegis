import { NextResponse } from "next/server";
const { AEGIS_SRV } = process.env;

export async function GET(res: NextResponse) {

  const url = `http://${AEGIS_SRV}/dashboard`;

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
