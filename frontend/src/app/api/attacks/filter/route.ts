import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const target = searchParams.get('target') || '';
  const attackVector = searchParams.get('attackVector') || '';
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');

  try {
    const whereClause: any = {
      ...(target && { target: { contains: target, mode: 'insensitive' } }),
      ...(attackVector && {
        attack_vector: { contains: attackVector, mode: 'insensitive' },
      }),
      ...(fromDate &&
        toDate && {
          date: {
            gte: new Date(fromDate).toISOString(),
            lte: new Date(toDate).toISOString(),
          },
        }),
    };

    const [attacks, total] = await Promise.all([
      db.attacks.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: {
          date: 'desc',
        },
      }),
      db.attacks.count({ where: whereClause }),
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({ attacks, total, pages, offset });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
