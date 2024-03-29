import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  console.log(`searchParams: ${searchParams}`);

  const name = searchParams.get('name') || '';
  const category = searchParams.get('category') || '';
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  try {
    const whereClause: any = {
      ...(category && { attack_vector: category }),
    };

    const [attacks, total] = await Promise.all([
      db.attacks.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
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
