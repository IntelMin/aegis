import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
const TokenInfoSet = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Made this timeout to show the skeleton loading will remove when api is ready
      setTimeout(() => setLoading(false), 2000);
    };

    loadData();
  }, []);

  const infoArr = [
    {
      key: 'Total supply',
      value: '595,265,721 OSMO',
      profit: 'null',
    },
    {
      key: 'Circulating Supply',
      value: '492,590,761 OSMO',
      profit: 'null',
    },
    {
      key: 'LP Holder',
      value: '3',
      profit: 'null',
    },
    {
      key: 'Honepot',
      value: 'False',
      profit: 'true',
    },
    {
      key: 'Anti Whale Check',
      value: 'True',
      profit: 'true',
    },
    {
      key: 'Opensource',
      value: 'True',
      profit: 'true',
    },
    {
      key: 'Ownership renounced',
      value: 'False',
      profit: 'false',
    },
    {
      key: 'High Severity Issues',
      value: '0',
      profit: 'null',
    },
    {
      key: 'Medium Severity Issues',
      value: '2',
      profit: 'null',
    },
    {
      key: 'Mintable',
      value: 'False',
      profit: 'true',
    },
    {
      key: 'Blacklist',
      value: 'True',
      profit: 'false',
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-4">
        {infoArr?.map(item => (
          <div
            className="w-full flex items-center justify-between"
            key={item.key}
          >
            <div className="flex gap-[4px] items-center">
              <p className="text-neutral-500 text-[12px]">{item.key}</p>
              <Image
                src="/icons/info.svg"
                alt="info-icon"
                width={13}
                height={13}
              />
            </div>
            {loading ? (
              <Skeleton className="w-20 h-4" />
            ) : (
              <p
                className={`${
                  item.profit === 'null'
                    ? 'text-neutral-200'
                    : item.profit === 'true'
                    ? 'text-green-300'
                    : 'text-red-300'
                } text-[14px]`}
              >
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenInfoSet;
