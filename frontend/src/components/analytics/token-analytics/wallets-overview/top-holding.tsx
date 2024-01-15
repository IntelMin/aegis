import React, { useEffect } from 'react';
import { GraphTypeHeader } from './graph-type-header';
import Image from 'next/image';
import { HoldingWalletChart } from './holding-wallet-chart';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  choosenType: string;
  handleTypeChange: (value: string) => void;
};

export const TopHolding = ({ choosenType, handleTypeChange }: Props) => {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Made this timeout to show the skeleton loading will remove when api is ready
      setTimeout(() => setIsLoading(false), 1000);
    };

    loadData();
  }, []);

  return (
    <div className="grid w-full h-full grid-cols-2 gap-2">
      <div className="flex flex-col col-span-2 md:col-span-1">
        <GraphTypeHeader
          choosenType={choosenType}
          handleTypeChange={handleTypeChange}
        />
        <HoldingWalletChart />
      </div>
      <div className="h-full col-span-2 md:col-span-1">
        <div className="w-full h-full p-2 bg-zinc-900">
          <div className="flex w-full items-center bg-zinc-800 rounded-[2px] p-2 gap-2">
            <Image
              src="/icons/search.svg"
              alt="search-icon"
              width={24}
              height={24}
            />
            <input
              type="text"
              placeholder="Search wallets"
              className="bg-transparent placeholder:text-sm"
            />
          </div>
          <table className="w-full mt-3">
            <tr className="w-full bg-[#0B0B0B] border-b border-zinc-600 grid grid-cols-8">
              <th className="col-span-1"></th>
              <th className="col-span-3 text-sm text-neutral-400 font-[300] text-center p-2">
                Wallet
              </th>
              <th className="col-span-3 text-sm text-neutral-400 font-[300] text-center p-2">
                (%)
              </th>
              <th className="col-span-1"></th>
            </tr>
            {isLoading ? (
              <div>
                <Skeleton className="w-full h-8 mb-2 mt-2" />
                <Skeleton className="w-full h-8 mb-2" />
                <Skeleton className="w-full h-8 mb-2" />
                <Skeleton className="w-full h-8 mb-2" />
                <Skeleton className="w-full h-8 mb-2" />
                <Skeleton className="w-full h-8 mb-2" />
                <Skeleton className="w-full h-8" />
              </div>
            ) : (
              <div className="overflow-y-scroll h-[265px]">
                {[1, 2, 3, 4, 5, 6, 7, 8]?.map(item => (
                  <tr
                    key={item}
                    className={`w-full my-2 grid grid-cols-8 items-center p-2 ${
                      item % 2 === 0 ? 'bg-[#0B0B0B]' : 'bg-transparent'
                    }`}
                  >
                    <td className="col-span-1 text-sm text-neutral-500">
                      #{item}
                    </td>
                    <td className="col-span-3 text-sm text-center text-blue-300">
                      0xde4...34edc
                    </td>
                    <td className="col-span-3 text-sm text-center text-neutral-100">
                      32%
                    </td>
                    <td className="col-span-1 w-[12px] h-[12px] bg-sky-500 rounded-full"></td>
                  </tr>
                ))}
              </div>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
