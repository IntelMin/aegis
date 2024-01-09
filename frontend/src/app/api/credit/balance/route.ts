import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const request = await req.json();
  const { email } = request;
  const user = await db.user.findUnique({ where: { email: email } });
  console.log(user);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const balance = await db.CreditBalance.findUnique({
    where: { userId: user.id },
  });
  console.log(balance);
  return NextResponse.json({ balance: balance.credits }, { status: 200 });
}
