import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { formatAddress } from '@/utils/format-address';
import { formatNumber } from '@/utils/format-number';

interface TokenDetails {
  address: string;
  circulating_market_cap: string;
  decimals: string;
  exchange_rate: string;
  holders: string;
  name: string;
  symbol: string;
  total_supply: string;
  type: string;
}

interface TokenInfoSetProps {
  tokenDetails: {
    token?: TokenDetails;
  };
}

const TokenInfoSet: React.FC<TokenInfoSetProps> = ({
  tokenDetails,
}: TokenInfoSetProps) => {
  const { token } = tokenDetails || {};
  const [infoArr, setInfoArr] = useState<
    Array<{ key: string; value: string | null }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;

        const infoArray = [
          { key: 'Address', value: token.address },
          {
            key: 'Circulating Market Cap',
            value: token.circulating_market_cap,
          },
          { key: 'Decimals', value: token.decimals },
          { key: 'Exchange Rate', value: token.exchange_rate },
          { key: 'Holders', value: token.holders },
          { key: 'Name', value: token.name },
          { key: 'Symbol', value: token.symbol },
          { key: 'Total Supply', value: token.total_supply },
          { key: 'Type', value: token.type },
        ];

        setInfoArr(infoArray);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="w-full">
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-4">
        {infoArr
          .filter(item => item.value !== null)
          .map(item => (
            <div
              key={item.key}
              className="w-full flex items-center justify-between"
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
              <p className="text-neutral-500 text-[14px]">
                {item.key === 'Address' ||
                item.key === 'Total Supply' ||
                item.key === 'Circulating Market Cap'
                  ? item.key === 'Address'
                    ? formatAddress(item.value || '')
                    : formatNumber(item.value as string)
                  : item.value}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TokenInfoSet;
