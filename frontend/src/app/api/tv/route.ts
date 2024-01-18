import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const pair = searchParams.get('pair')
  const res = searchParams.get('res')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const pairInfo = await fetch(`https://app.geckoterminal.com/api/p1/eth/pools/${pair}`).then(res => res.json())
  const a = pairInfo.data.id
  const b = pairInfo.data.relationships.pairs.data[0].id

  const { data } = await fetch(`https://app.geckoterminal.com/api/p1/candlesticks/${a}/${b}?resolution=${res}&from_timestamp=${from}&to_timestamp=${to}`).then(res => res.json())

  return NextResponse.json(data);
}
