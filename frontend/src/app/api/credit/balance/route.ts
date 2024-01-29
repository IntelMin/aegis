import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({ where: { email } });
    const balance = await db.credit_balance.findUnique({
      where: { user_id: user?.id },
    });

    return NextResponse.json(
      { balance: balance?.credits ?? 0 },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Error fetching balance' },
      { status: 500 }
    );
  }
}
