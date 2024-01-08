import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const TokenStatCard = () => {
  const [active, setActive] = useState('24H');
  const [loading, setLoading] = useState(true);
  const btnArr = ['5m', '1H', '4H', '12H', '24H', '2D'];

  // This is just to show the skeleton loading will remove when api is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const statArr = [
    {
      key: 'TXNS',
      value: '9,289',
      status: 'null',
    },
    {
      key: 'BUY TAX',
      value: '0.32%',
      status: 'true',
    },
    {
      key: 'SELL TAX',
      value: '0.32%',
      status: 'true',
    },
    {
      key: 'VOLUME',
      value: '$12.21M',
      status: 'null',
    },
    {
      key: 'BUY VOL',
      value: '$6.207M',
      status: 'true',
    },
    {
      key: 'SELL VOL',
      value: '$6.0M',
      status: 'false',
    },
    {
      key: 'TRADERS',
      value: '3,920',
      status: 'null',
    },
    {
      key: 'BUYERS',
      value: '3,266',
      status: 'null',
    },
    {
      key: 'SELLERS',
      value: '1,275',
      status: 'null',
    },
  ];

  return (
    <div className="border border-zinc-900 p-2 flex flex-col gap-6 mt-3">
      {/* Button Group */}
      <div className="flex justify-between bg-zinc-900 rounded-[6px]">
        {btnArr.map(item => (
          <button
            key={item}
            type="button"
            onClick={() => setActive(item)}
            className={`${
              item === active ? 'text-white' : 'text-neutral-500'
            } hover:text-white transition-all ease-in duration-150 p-1 px-2`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-3 gap-2">
        {statArr.map(item => (
          <div
            key={item.key}
            className="cursor-pointer col-span-1 rounded-[4px] flex flex-col items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 transition-all ease-in duration-100"
          >
            {loading ? (
              <Skeleton className="w-20 h-4" />
            ) : (
              <h1
                className={`${
                  item.status === 'null'
                    ? 'text-white'
                    : item.status === 'true'
                    ? 'text-green-400'
                    : 'text-red-400'
                } text-[14px] leading-[16px]`}
              >
                {item.value}
              </h1>
            )}
            <p className="text-neutral-500 text-[10px]">{item.key}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenStatCard;
