import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  let queryParams: Record<string, string> = {};

  Array.from(searchParams.entries()).forEach(([key, value]) => {
    if (key !== 'type' && value) {
      queryParams[key] = value;
    }
  });

  const queryString = qs.stringify(queryParams, { skipNulls: true });
  const url = `${process.env.AEGIS_SRV}/analytics/${type}?${queryString}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 15 * 60,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 404 });
  }
}
