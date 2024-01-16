import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/utils/format-number';

const Statistic: React.FC<{
  value: string;
  subLabel?: string;
  percentage?: boolean;
}> = ({ value, subLabel, percentage }) => {
  let colorClass = 'text-zinc-100';
  if (percentage) {
    const numericValue = parseFloat(value);
    colorClass = numericValue >= 0 ? 'text-green-700' : 'text-red-700';
  }

  return (
    <div className="cursor-pointer col-span-1 rounded-[4px] flex flex-col items-center gap-2 transition-all ease-in duration-100">
      <div className="flex flex-col items-center bg-zinc-900 p-2 rounded-lg w-full text-center">
        <h1 className={`${colorClass} text-[14px] leading-[16px]`}>{value}</h1>
        {subLabel && (
          <p className="text-neutral-500 text-[10px] pt-1 uppercase">
            {subLabel}
          </p>
        )}
      </div>
    </div>
  );
};

const TokenStatCard = ({ liveData }: any) => {
  const [active, setActive] = useState('24h');
  const [loading, setLoading] = useState(true);
  const btnArr = ['1h', '6h', '24h'];
  const switchRes: { [key: string]: string } = {
    '1h': 'h1',
    '6h': 'h6',
    '24h': 'h24',
  };

  console.log(liveData);

  useEffect(() => {
    setLoading(!liveData);
  }, [liveData]);

  const getStatValue = (key: string) => liveData?.[key]?.[switchRes[active]];

  return (
    <div className="border border-zinc-900 p-2 flex flex-col gap-2 mt-3">
      {/* Button Group */}
      <div className="flex justify-between bg-zinc-900 rounded-[6px]">
        {btnArr.map(item => (
          <button
            key={item}
            type="button"
            onClick={() => setActive(item)}
            className={`${
              item === active ? 'text-white bg-zinc-800' : 'text-neutral-500'
            } hover:text-white transition-all ease-in duration-150 p-1 px-2 w-full text-sm`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-4 gap-2">
        {loading ? (
          <>
            <Skeleton className="w-12 h-10 m-2" />
            <Skeleton className="w-12 h-10 m-2" />
            <Skeleton className="w-12 h-10 m-2" />
            <Skeleton className="w-12 h-10 m-2" />
          </>
        ) : (
          <>
            <Statistic value={getStatValue('txns')?.buys} subLabel="Buys" />
            <Statistic value={getStatValue('txns')?.sells} subLabel="Sells" />
            <Statistic
              value={getStatValue('priceChange')}
              subLabel="Change"
              percentage={true}
            />
            <Statistic
              value={formatNumber(getStatValue('volume'))}
              subLabel="Volume"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TokenStatCard;
