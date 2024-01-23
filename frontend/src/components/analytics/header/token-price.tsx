import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

type Props = {
  liveData: any;
};

export const TokenPrice = ({ liveData }: Props) => {
  return (
    <div className="flex max-md:flex-col max-md:gap-1 md:items-center gap-4">
      {liveData?.priceUsd ? (
        <h1 className="text-neutral-50 text-[28px] leading-[35px] md:leading-[40px] font-[700]">
          ${liveData.priceUsd}
        </h1>
      ) : (
        <Skeleton className="w-32 h-8" />
      )}
      <div className="flex items-center">
        {liveData?.priceChange?.h24 !== undefined ? (
          <>
            {liveData.priceChange.h24 >= 0 ? (
              <>
                <BiChevronUp className="text-green-700" />
                <h5 className="text-green-700">{liveData.priceChange.h24}%</h5>
              </>
            ) : (
              <>
                <BiChevronDown className="text-red-700" />
                <h5 className="text-red-700">
                  {Math.abs(liveData.priceChange.h24)}%
                </h5>
              </>
            )}
          </>
        ) : (
          <Skeleton className="w-10 h-4" />
        )}
      </div>
    </div>
  );
};
