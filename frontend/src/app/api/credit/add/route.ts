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
    // const amount_in = ethers.utils.formatEther(txn.value);
    // const credits = (Number(amount_in) / 0.5) * 100;
    // const user = await db.user.findFirst({ where: { email: email } });
    // console.log(user);
    // const data = {
    //   packageBought: packageName,
    //   amountETH: amount_in,
    //   creditsAdded: credits,
    //   hash: hash,
    //   user: {
    //     connect: {
    //       id: user?.id,
    //     },
    //   },
    // };

    // const logtxn = await db.CreditPayment.create({
    //   data: {
    //     amountETH: Number(amount_in),
    //     creditsAdded: credits,
    //     hash: hash,
    //     packageBought: packageName,
    //     user: {
    //       connect: {
    //         id: user?.id,
    //       },
    //     },
    //   },
    // });
    // const balanceUpdate = await db.CreditBalance.upsert({
    //   where: {
    //     userId: user?.id,
    //   },
    //   create: {
    //     credits: credits,
    //     user: {
    //       connect: {
    //         id: user?.id,
    //       },
    //     },
    //   },
    //   update: {
    //     credits: {
    //       increment: credits,
    //     },
    //   },
    // });

    if (logtxn) {
      return NextResponse.json({
        status: 'success',
        balance: balanceUpdate.credits,
      });
    }
    return NextResponse.json({ status: 'failed' });
  } else {
    return NextResponse.json({ status: 'failed' });
  }
}
