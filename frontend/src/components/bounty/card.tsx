import Image from 'next/image';
import React from 'react';

type Props = {};

export const BountyCard = (props: Props) => {
  return (
    <div className="col-span-4 md:col-span-1 bg-zinc-900 p-2">
      <div
        style={{
          clipPath:
            'polygon(20% 0, 100% 0, 100% 50%, 100% 100%, 0 100%, 0 20%)',
        }}
        className="flex flex-col justify-center p-4 gap-14 relative overflow- bg-[#0D0D0D] rounded-md"
      >
        <div className="flex flex-col gap-2 text-center items-center z-[5]">
          <Image
            alt="bounty"
            src="/icons/bounty/bounty-default.png"
            width={32}
            height={32}
          />
          <p className="text-sm font-semibold text-zinc-200">ApeCoin Mainnet</p>
        </div>
        <div className="flex flex-col gap-2 text-center items-center z-[5]">
          <h1 className="text-[40px] font-bold text-zinc-50">$10,830,000</h1>
          <p className="text-sm font-[500] text-zinc-50 uppercase">
            bounty reward
          </p>
        </div>
        <div className="flex flex-col gap-2 text-center items-center">
          <p className="text-[12px] font-[500] text-zinc-200 z-[5]">
            Updated 2 Weeks Ago
          </p>
        </div>
        <Image
          src="/icons/bounty/blue-ellipse.svg"
          alt="ellipse"
          width={220}
          height={220}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-[3]"
        />
        <Image
          src="/icons/bounty/vector-1.png"
          alt="ellipse"
          width={320}
          height={320}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[2]"
        />
      </div>
    </div>
  );
};
