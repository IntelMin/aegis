import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function GET(req: NextRequest) {
  const abi = [
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint8',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ];
  const url = req.nextUrl;
  const token = url.searchParams.get('token');
  console.log('token');
  console.log(token);
  try {
    const decimals = await publicClient.readContract({
      address: token as `0x${string}`,
      functionName: 'decimals',
      abi,
    });
    console.log(decimals);
    return NextResponse.json({ address: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ address: false });
  }
}
