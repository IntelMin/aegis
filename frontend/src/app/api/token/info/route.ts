import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');
  const type = searchParams.get('type');
  console.log(type);
  try {
    let url = `${process.env.AEGIS_SRV}/info/${type}/${address}`;
    const response = await axios.get(url);
    // console.log(response.data);
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
