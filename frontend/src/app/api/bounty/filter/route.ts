import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  console.log(`searchParams: ${searchParams}`);

  const name = searchParams.get('name');
  const category = searchParams.get('category');
  const language = searchParams.get('language');
  const isPaid = searchParams.get('isPaid');
  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');
  const rewards = searchParams.get('bounty');
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  try {
    const whereClause: any = {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(category && { category_list: { has: category } }),
      ...(language && { language_list: { has: language } }),
      ...(rewards && { max_reward: { lte: parseInt(rewards) } }),
      ...(isPaid !== null &&
        isPaid !== undefined && {
          total_paid_metric_enabled: isPaid === 'true',
        }),
      ...(fromDate &&
        toDate && {
          date: {
            gte: new Date(fromDate).toISOString(),
            lte: new Date(toDate).toISOString(),
          },
        }),
    };

    const [bounties, total] = await Promise.all([
      db.bounties.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: {
          id: 'asc',
        },
      }),
      db.bounties.count({ where: whereClause }),
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({ bounties, total, pages, offset });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
