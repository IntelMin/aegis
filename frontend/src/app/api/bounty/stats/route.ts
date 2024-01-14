import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get(`${process.env.AEGIS_SRV}/bounty/stats`);

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
