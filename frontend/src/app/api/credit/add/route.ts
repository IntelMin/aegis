import { NextRequest, NextResponse } from 'next/server';
// import { ethers } from 'ethers';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { db } from '@/lib/db';
import { creditConfig, credits_chart } from '@/lib/credit-config';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export async function POST(req: NextRequest, res: Response) {
  const request = await req.json();
  const { email, amount, packageName, hash } = request;
  const txn = await publicClient.getTransaction({
    hash: hash,

  });

  if (txn) {

    const txnr = await publicClient.waitForTransactionReceipt({
      hash: hash,
    });
    console.log(txnr);
    if (txnr.status != 'success') {
      return NextResponse.json({ status: 'failed' });
    }
    const { from, to, value } = txn;
    if (to === process.env.NEXT_PUBLIC_AEGIS_WALLET) {
      return NextResponse.json({ status: 'failed' });
    }
    const amount_in = Number(txn.value) / 10 ** 18;
    console.log(amount_in);



    const credit_package = credits_chart.find(credit => credit.amount === amount_in);

    const user = await db.user.findFirst({ where: { email: email } });
    console.log(user);


    const logtxn = await db.credit_payment.create({
      data: {
        amount_eth: Number(amount_in),
        credits: credit_package ? credit_package.credits : 0,
        hash: hash,
        package: credit_package ? credit_package.package : 'unknown',
        user: {
          connect: {
            id: user?.id,
            email: email,
          },
        },
      },
    });
    if (!logtxn) {
      return NextResponse.json({ status: 'failed' });
    }

    const balanceUpdate = await db.credit_balance.upsert({
      where: {
        user_id: user?.id,
      },
      create: {
        credits: credit_package ? credit_package.credits : 0,
        user: {
          connect: {
            id: user?.id,
            email: email,
          },
        },
      },
      update: {
        credits: {
          increment: credit_package ? credit_package.credits : 0,
        },
      },
    });
    return NextResponse.json({
      status: 'success',
      balance: balanceUpdate.credits,
    });
  } else {
    return NextResponse.json({ status: 'failed' });
  }
}
