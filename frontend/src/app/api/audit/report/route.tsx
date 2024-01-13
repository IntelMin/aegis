import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const request = await req.json();
  const { address } = request;
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.id;
  const paid_user = await db.paid_audits.findFirst({
    where: {
      user_id: Number(user_id),
      address: address,
      type: 'report',
    },
  });
  if (!paid_user) {
    return NextResponse.json({
      status: 'failed',
      message: "You have't paid for this report yet.",
    });
  }
  const report_request = await db.report_requests.findFirst({
    where: {
      address: address,
    },
  });
  if (!report_request) {
    const insert_report_request = await db.report_requests.create({
      data: {
        address: address,
        user_id: Number(user_id),
        status: 'requested',
      },
    });
    return NextResponse.json({
      status: 'success',
      message: 'Report requested successfully.',
    });
  }
  if (report_request.status === 'requested') {
    return NextResponse.json({
      status: 'success',
      message: 'Report requested successfully.',
    });
  }
  if (report_request.status === 'completed') {
    return NextResponse.json({
      status: 'success',
      message: 'Report ready to download',
    });
  }

  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       address: address,
  //       user_id: user_id,
  //     }),
  //   });
  //   const report_response = await report_request.json();
}

export async function GET(req: NextRequest, res: NextResponse) {
  const url = new URL(req.nextUrl);
  const address = url.searchParams.get('address');
  if (!address) {
    return NextResponse.json({
      status: 'failed',
      message: 'Address not provided.',
    });
  }
  const report_request = await db.report_requests.findFirst({
    where: {
      address: address,
    },
  });
  if (!report_request) {
    return NextResponse.json({
      status: 'failed',
      message: 'Report not requested yet.',
    });
  }
  if (report_request.status === 'requested') {
    return NextResponse.json({
      status: 'success',
      message: 'Report requested successfully.',
    });
  }
  if (report_request.status === 'completed') {
    // const report = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/api/audit/report/${address}`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );
    const reportUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/audit/report/${address}`;
    return NextResponse.rewrite(reportUrl);
  }
}
