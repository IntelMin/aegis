import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit');
  const resolution = searchParams.get('resolution');

  let interval = 1;

  if (resolution === '1h') {
    interval = 1;
  } else if (resolution === '4h') {
    interval = 4;
  } else if (resolution === '12hr') {
    interval = 12;
  } else if (resolution === '1d') {
    interval = 24;
  }

  try {
    const response = await axios.get(
      `${process.env.AEGIS_SRV}/dashboard/trending?interval=${interval}`
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
