import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit');
  const resolution = Number(searchParams.get('resolution')) ?? 60;

  try {
    const response = await axios.get(
      `${process.env.AEGIS_SRV}/dashboard/trending?interval=${resolution / 60}`
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
