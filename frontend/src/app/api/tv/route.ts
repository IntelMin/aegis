import { NextRequest, NextResponse } from 'next/server';
import { CurlImpersonate } from 'node-curl-impersonate';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = [
    ["sym", "usd"],
    ["span", searchParams.get('span')],
    ["pair", searchParams.get('pair')],
    ["ts", searchParams.get('ts')],
    ["res", searchParams.get('res')]
  ].map(([name, value]) => `${name}=${value}`).join("&")

  const url = `https://www.dextools.io/chain-bsc/api/generic/history/candles/v4?${query}`;
  console.log(url)
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    impersonate: 'chrome-110',
    verbose: false,
  };

  const curl = new CurlImpersonate(url, options);
  const response = await curl.makeRequest()
  console.log('*************', response)
  return NextResponse.json(JSON.parse(response.response));
}
