import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');
  const type = searchParams.get('type');

  console.log('address: ', address);
  console.log('type: ', type);

  try {
    let url = `${process.env.AEGIS_SRV}/info/request/${address}`;
    if (type === 'meta') {
      url = `${process.env.AEGIS_SRV}/info/meta/${address}`;
    }
    const response = await axios.get(url);

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