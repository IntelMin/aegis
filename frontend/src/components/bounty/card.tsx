import { formatAge } from '@/utils/format-age';
import { formatNumber } from '@/utils/format-number';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  i: number;
  bounty: any;
};

export const BountyCard = ({ i, bounty }: Props) => {
  return (
    <div className="col-span-4 md:col-span-1 bg-zinc-900 p-2 rounded-md">
      <div
        style={{
          clipPath:
            'polygon(20% 0, 100% 0, 100% 50%, 100% 100%, 0 100%, 0 20%)',
        }}
        className="flex flex-col justify-center p-4 gap-14 relative overflow- bg-[#0D0D0D] rounded-md"
      >
        <div className="flex flex-col gap-2 text-center items-center z-[5]">
          <img alt={bounty.name} src={bounty.logo} width={40} height={40} />
          <Link
            href={bounty.link}
            className="text-sm font-semibold text-zinc-200"
          >
            {bounty.name}
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-center items-center z-[5]">
          <h1 className="text-[40px] font-bold text-zinc-50">
            {formatNumber(bounty.max_reward)}
          </h1>
          <p className="text-sm font-[500] text-zinc-50 uppercase">
            bounty reward
          </p>
        </div>
        <div className="flex flex-col gap-2 text-center items-center">
          <p className="text-[12px] font-[500] text-zinc-200 z-[5]">
            Updated {formatAge(new Date(bounty.last_updated_date).getTime())}
          </p>
        </div>
        <Image
          src={`/icons/bounty/${
            bounty.total_paid_metric_enabled ? 'green' : 'blue'
          }-ellipse.svg`}
          alt="ellipse"
          width={280}
          height={280}
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${
            bounty.total_paid_metric_enabled ? '' : 'translate-y-1/2'
          } z-[3]`}
        />
        <Image
          src={`/icons/bounty/vector-${(i % 3) + 1}.png`}
          alt="ellipse"
          width={320}
          height={320}
          className={`absolute bottom-0 left-1/2 ${
            i % 3 !== 0 ? 'translate-y-[30%]' : ''
          } -translate-x-1/2 z-[2]`}
        />
      </div>
    </div>
  );
};
