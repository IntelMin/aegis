import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  console.log('address: ', address);

  const url = `${process.env.AEGIS_SRV}/token/live/${address}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 30,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 404 });
  }
}
