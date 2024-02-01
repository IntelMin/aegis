import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const img = searchParams.get('q');

  if (!img) {
    return new Response('Image query parameter is missing', { status: 400 });
  }

  //   const fullImageUrl = `https://token-media.defined.fi/${decodeURIComponent(
  //     img
  //   )}`;

  const fullImageUrl = img;

  try {
    const imageRes = await fetch(fullImageUrl);
    const imageBuffer = await imageRes.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error fetching image', { status: 500 });
  }
}
