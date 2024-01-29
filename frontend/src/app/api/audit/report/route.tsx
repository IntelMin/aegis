import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const request = await req.json();
  const { address } = request;

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({
        status: 'error',
        message: 'User not logged in.',
      });
    }

    const paid = await db.paid_audits.findFirst({
      where: {
        user_id: session.user.id,
        address: address,
        type: 'report',
      },
    });

    if (!paid) {
      return NextResponse.json({
        status: 'error',
        message: "You haven't paid for this report yet.",
      });
    }

    const existingRequest = await db.report_requests.findFirst({
      where: { address, user_id: session.user.id },
    });

    if (existingRequest) {
      return NextResponse.json({
        status:
          existingRequest.status !== 'completed' ? 'requested' : 'success',
        message:
          existingRequest.status === 'completed'
            ? 'Report ready to download'
            : 'Report already requested',
      });
    }

    await db.report_requests.create({
      data: {
        address,
        user_id: session.user.id,
        status: 'requested',
      },
    });

    return NextResponse.json({
      status: 'requested',
      message: 'Report requested successfully.',
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 'success',
      message: 'Error requesting report',
    });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  const url = new URL(req.nextUrl);
  const address = url.searchParams.get('address') || '';
  console.log('Fetching report for: ', address);

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({
        status: 'failed',
        message: 'User not logged in.',
      });
    }

    const paid = await db.paid_audits.findFirst({
      where: {
        user_id: session.user.id,
        address: address,
        type: 'report',
      },
    });

    if (!paid) {
      return NextResponse.json({
        status: 'failed',
        message: "You haven't paid for this report yet.",
      });
    }

    const existingRequest = await db.report_requests.findFirst({
      where: { address, user_id: session.user.id },
    });

    if (existingRequest) {
      if (existingRequest.status === 'requested') {
        return NextResponse.json({
          status: 'requested',
          message: 'Report requested successfully.',
        });
      } else if (existingRequest.status === 'failed') {
        return NextResponse.json({
          status: 'failed',
          message: 'Report failed to generate.',
        });
      }
    }

    const report = await fetch(
      `${process.env.AEGIS_SRV}/report/download/${address.trim()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!report.ok) {
      console.error('Failed to fetch report:', report.statusText);
      return NextResponse.json({
        status: 'failed',
        message: 'Failed to fetch report.',
      });
    }

    const report_response = await report.json();
    // const reportData = await report_response.arrayBuffer();
    // const reportBase64 = btoa(
    //   String.fromCharCode.apply(null, Array.from(new Uint8Array(reportData)))
    // );

    return NextResponse.json({
      status: 'success',
      message: 'Report downloaded successfully.',
      report: report_response.report,
      name: report_response.name,
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({
      status: 'failed',
      message: 'An unexpected error occurred while fetching the report.',
    });
  }
}
