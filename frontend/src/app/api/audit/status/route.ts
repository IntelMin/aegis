import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '@/lib/db';
import { AUDIT_STATUS_RETURN_CODE } from '@/utils/audit-statuses';

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  const address = data.address;
  console.log('fetch audit for: ', address);

  try {

    const response = await axios.get(
      `${process.env.AEGIS_SRV}/audit/status/${address}`
    );
    console.log('response: ', response.data);
    return NextResponse.json(response.data);

  } catch (error) {
    console.log('error: ', error);
    return NextResponse.json(error, { status: 404 });

  }
}
