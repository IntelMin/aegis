import { NextRequest, NextResponse } from 'next/server';
// import { ethers } from 'ethers';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { db } from '@/lib/db';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export async function POST(req: NextRequest, res: Response) {
  const request = await req.json();
  const { email, amount, packageName, hash } = request;
  console.log(request);
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

    const credits_chart = [
      { credits: 100, amount: 0.5 },
      { credits: 230, amount: 1 },
      { credits: 600, amount: 2 },
    ];

    const credits = credits_chart.find(credit => credit.amount === amount_in);

    const user = await db.user.findFirst({ where: { email: email } });
    console.log(user);
    const data = {
      packageBought: packageName,
      amount_eth: amount_in,
      credits: credits,
      hash: hash,
      user: {
        connect: {
          id: user?.id,
        },
      },
    };

    const logtxn = await db.credit_payment.create({
      data: {
        amount_eth: Number(amount_in),
        credits: credits ? credits.credits : 0,
        hash: hash,
        package: packageName,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    const balanceUpdate = await db.credit_balance.upsert({
      where: {
        user_id: user?.id,
      },
      create: {
        credits: credits ? credits.credits : 0,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
      update: {
        credits: {
          increment: credits ? credits.credits : 0,
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
