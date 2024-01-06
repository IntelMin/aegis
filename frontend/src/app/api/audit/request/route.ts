import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  const address = data.address;
  console.log('fetch audit for: ', address);

  try {
    const response = await axios.get(
      `${process.env.AEGIS_SRV}/audit/request/${address}`
    );

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
