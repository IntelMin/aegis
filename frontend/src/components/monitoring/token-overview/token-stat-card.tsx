import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const TokenStatCard = ({ liveData }: any) => {
  const [active, setActive] = useState('24H');
  const [loading, setLoading] = useState(true);
  const btnArr = ['1H', '6H', '24H'];
  console.log('oooo', liveData);

  const getStatValue = (key: string) => {
    switch (active) {
      case '1H':
        return liveData?.[key]?.h1;
      case '6H':
        return liveData?.[key]?.h6;
      case '24H':
        return liveData?.[key]?.h24;
      default:
        return null;
    }
  };

  const getTxnsValue = (key: string, type: string) => {
    switch (active) {
      case '1H':
        return liveData?.[key]?.h1?.[type];
      case '6H':
        return liveData?.[key]?.h6?.[type];
      case '24H':
        return liveData?.[key]?.h24?.[type];
      default:
        return null;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const statArr = [
    { key: 'txns', label: 'Transactions' },
    { key: 'priceChange', label: 'Price Change' },
    { key: 'volume', label: 'Volume' },
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
              item === active ? 'text-white bg-zinc-800' : 'text-neutral-500'
            } hover:text-white transition-all ease-in duration-150 p-1 px-2 w-full`}
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
            className="cursor-pointer col-span-1 rounded-[4px] flex flex-col items-center gap-2 transition-all ease-in duration-100"
          >
            {loading ? (
              <Skeleton className="w-20 h-10" />
            ) : (
              <>
                {item.key === 'txns' ? (
                  <>
                    <div className="flex flex-col items-center bg-zinc-900 p-2 rounded-lg w-full text-center">
                      <div>
                        <h1 className="text-white text-[14px] leading-[16px]">
                          {getTxnsValue(item.key, 'buys')}
                        </h1>
                        <p className="text-neutral-500 text-[10px]">Buys</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center bg-zinc-900 p-2 py-1 rounded-lg w-full text-center">
                      <div>
                        <h1 className="text-white text-[14px] leading-[16px]">
                          {getTxnsValue(item.key, 'sells')}
                        </h1>
                        <p className="text-neutral-500 text-[10px]">Sells</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className=" flex flex-col bg-zinc-900 p-2 rounded-lg w-full text-center">
                    <h1 className="text-white text-[14px] leading-[16px]">
                      {getStatValue(item.key)}
                    </h1>
                    <p className="text-neutral-500 text-[10px]">{item.label}</p>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenStatCard;
