import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import Image from 'next/image';
import React from 'react';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const img = searchParams.get('q');

  console.log(img);

  if (!img) {
    return false;
  }

  const fullImageUrl = `https://token-media.defined.fi/${decodeURIComponent(
    img
  )}`;

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
