import { authOptions } from '@/lib/auth';
import { creditConfig } from '@/lib/credit-config';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

type CreditConfigType = keyof typeof creditConfig;

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ status: 'error', message: 'Unauthorized' });
  }

  const { type, address } = await req.json();
  if (!Object.keys(creditConfig).includes(type)) {
    return NextResponse.json({
      status: 'error',
      message: 'Invalid audit type requested',
    });
  }

  const existingAudit = await db.paid_audits.findFirst({
    where: { user_id: userId, type, address },
  });

  let userCredit = await db.credit_balance.findFirst({
    where: { user_id: userId },
  });
  if (!userCredit) {
    userCredit = await db.credit_balance.create({
      data: { user_id: userId, credits: 0 },
    });
  }

  if (existingAudit) {
    return NextResponse.json({
      status: 'success',
      message: 'Already paid',
      credits: userCredit.credits,
    });
  }

  const requestedCredit = creditConfig[type as CreditConfigType];
  if (userCredit.credits < requestedCredit) {
    return NextResponse.json({
      status: 'error',
      message: 'Insufficient credits',
    });
  }

  try {
    const creditTransaction = await db.credit_transactions.create({
      data: {
        type,
        cost: requestedCredit,
        user: { connect: { id: userId } },
      },
    });

    const updatedCredit = await db.credit_balance.update({
      where: { user_id: userId },
      data: { credits: userCredit.credits - requestedCredit },
    });

    await db.paid_audits.create({
      data: {
        address: address ?? '',
        credit_transaction_id: creditTransaction.id,
        type,
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json({
      status: 'success',
      credits: updatedCredit.credits,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      status: 'error',
      message: 'Payment error',
      credits: userCredit.credits,
    });
  }
}
