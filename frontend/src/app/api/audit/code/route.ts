import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  const source = data.source;
  console.log('fetch audit for: ', source.legnth);

  try {
    const response = await axios.post(`${process.env.AEGIS_SRV}/audit/code`, {
      source: source,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (error) {
      console.log(error);
      return NextResponse.json(error, { status: 404 });
    } else {
      return NextResponse.error();
    }
  }
}
