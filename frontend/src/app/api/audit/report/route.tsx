import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const request = await req.json();
  const { address } = request;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({
      status: 'failed',
      message: 'User not logged in.',
    });
  }
  const user = await db.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    return NextResponse.json({
      status: 'failed',
      message: 'User not found.',
    });
  }
  const user_id = user.id;
  console.log('user_id', session);
  const paid_user = await db.paid_audits.findFirst({
    where: {
      user_id: Number(user_id),
      address: address,
      type: 'report',
    },
  });
  // if (!paid_user) {
  //   return NextResponse.json({
  //     status: 'failed',
  //     message: "You have't paid for this report yet.",
  //   });
  // }
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
  console.log('address1', address);
  if (!address) {
    return NextResponse.json({
      status: 'failed',
      message: 'Address not provided.',
    });
  }
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({
      status: 'failed',
      message: 'User not logged in.',
    });
  }
  const user = await db.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    return NextResponse.json({
      status: 'failed',
      message: 'User not found.',
    });
  }
  const user_id = user.id;
  const paid_user = await db.paid_audits.findFirst({
    where: {
      user_id: Number(user_id),
      address: address,
      type: 'report',
    },
  });
  // if (!paid_user) {
  //   return NextResponse.json({
  //     status: 'failed',
  //     message: "You have't paid for this report yet.",
  //   });
  // }
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
      status: 'requested',
      message: 'Report requested successfully.',
    });
  }
  const report = await fetch(
    `${process.env.AEGIS_SRV}/api/audit/report/${address}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  console.log('report', report_request);
  const report_response = await report.blob();
  const reportData = await report_response.arrayBuffer();
  const reportBase64 = btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(reportData)))
  );

  return NextResponse.json({
    status: 'success',
    message: 'Report encoded to base64 successfully.',
    report: reportBase64,
    name: `${report_request.name}`,
  });
  // console.log('report_request', report_request);
  // if (report_request.status === 'completed') {
  //   const reportUrl = new URL(
  //     `${process.env.AEGIS_SRV}/api/audit/report/${address}`
  //   );
  //   return NextResponse.redirect(reportUrl);
  // }
  // console.log('report_request', report_request);
  // if (report_request.status === 'completed') {
  //   const reportUrl = new URL(
  //     `${process.env.AEGIS_SRV}/api/audit/report/${address}`
  //   );
  //   return NextResponse.redirect(reportUrl);
  // }
}
