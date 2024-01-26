import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query || query.length < 2) {
    return new NextResponse(null, { status: 400 });
  }

  const url = `${process.env.AEGIS_SRV}/search/${query}`;

  try {
    const res = await fetch(url, {
      //   next: {
      //     revalidate: 15 * 60,
      //   },
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
