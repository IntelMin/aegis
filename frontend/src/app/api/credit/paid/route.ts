import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ status: 'error' }, { status: 401 });
  }

  const request = await req.json();
  const { address, type } = request;

  try {
    const paidAudit = await db.paid_audits.findFirst({
      where: {
        user: {
          email: email,
        },
        address: address,
        type: type,
      },
    });

    const isPaid = !!paidAudit;
    return NextResponse.json({ status: 'success', paid: isPaid });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ status: 'error' }, { status: 401 });
  }
  const user = await db.user.findUnique({ where: { email: email } });
  if (!user) {
    return NextResponse.json({ status: 'error' }, { status: 401 });
  }
  console.log({ user });
  const id = user?.id;
  const paid_audits = await db.paid_audits.findMany({
    where: { user_id: Number(id) },
  });
  return NextResponse.json({ status: 'success', paid_audits: paid_audits });
}
