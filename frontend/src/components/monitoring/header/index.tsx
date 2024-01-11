import React from 'react';
import Image from 'next/image';
import { formatNumber } from '@/utils/format-number';
import { formatAge } from '@/utils/format-age';
import TokenValueContainer from './token-value-container';
import { Skeleton } from '@/components/ui/skeleton';
import { formatAddress } from '@/utils/format-address';

type Props = {
  showTitle: boolean;
  showPremium: boolean;
  metadata: any;
  liveData: any;
};

const TokenValue = ({ showTitle, metadata, liveData }: Props) => {
  return (
    <div className="container p-0 mx-auto">
      <div className="flex flex-wrap max-md:flex-col md:items-center justify-around gap-4">
        <div className={`${showTitle ? '' : 'hidden'} flex-1`}>
          <div className="col-span-1 flex items-center justify-between">
            <div className="flex gap-2 items-start md:items-center">
              <Image
                src={
                  metadata?.imageSmallUrl
                    ? `/api/token/image?q=${metadata.imageSmallUrl
                        .split('/')
                        .pop()}`
                    : `/icons/token-default.svg`
                }
                alt="token"
                width={32}
                height={32}
              />
              <div className="flex gap-2 max-md:flex-col md:items-center">
                {metadata?.name ? (
                  <h1 className="text-neutral-300 text-[24px] leading-[32px] font-600">
                    {metadata.name}
                  </h1>
                ) : (
                  <Skeleton className="w-20 h-6" />
                )}
                {metadata?.symbol ? (
                  <h3 className="text-neutral-500 text-[20px] leading-[24px] font-500">
                    {metadata.symbol}
                  </h3>
                ) : (
                  <Skeleton className="w-10 h-5" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4">
            {liveData?.priceUsd ? (
              <h1 className="text-neutral-50 text-[28px] leading-[40px] font-[700]">
                ${liveData.priceUsd}
              </h1>
            ) : (
              <Skeleton className="w-32 h-8" />
            )}
            <div className="flex items-center">
              <Image
                src="/icons/profit.svg"
                alt="profit"
                width={7}
                height={7}
              />
              {liveData?.priceChange?.h24 ? (
                <h5 className="text-green-600">{liveData.priceChange.h24} %</h5>
              ) : (
                <Skeleton className="w-10 h-4" />
              )}
            </div>
          </div>
        </div>

        <div className="flex max-md:hidden flex-1">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <p className="text-neutral-100 text-[14px] w-[70px] text-right">
                {metadata ? (
                  metadata?.symbol
                ) : (
                  <Skeleton className="w-14 h-6" />
                )}
                :{' '}
              </p>
              <div className="flex items-center gap-[4px]">
                <p className="text-blue-400 text-[14px] leading-[20px]">
                  {metadata ? (
                    formatAddress(metadata?.address)
                  ) : (
                    <Skeleton className="w-36 h-4" />
                  )}
                </p>
                <button>
                  <Image
                    src="/icons/copy.svg"
                    alt="network-icon"
                    width={16}
                    height={16}
                  />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-neutral-100 text-[14px] w-[70px] text-right">
                PAIR:{' '}
              </p>
              <div className="flex items-center gap-[4px]">
                <p className="text-blue-400 text-[14px] leading-[20px]">
                  {liveData?.pairAddress ? (
                    formatAddress(liveData?.pairAddress)
                  ) : (
                    <Skeleton className="w-24 h-4" />
                  )}
                </p>
                <button>
                  <Image
                    src="/icons/copy.svg"
                    alt="network-icon"
                    width={16}
                    height={16}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row max-md:flex-wrap flex-1 gap-4 md:gap-2">
          {liveData ? (
            <>
              <TokenValueContainer
                name="MCAP"
                value={formatNumber(liveData.fdv)}
              />
              <TokenValueContainer
                name="LIQUIDITY"
                value={formatNumber(liveData.liquidity.usd)}
              />
              <TokenValueContainer
                name="VOL (24H)"
                value={formatNumber(liveData.volume.h24)}
              />
              <TokenValueContainer
                name="AGE"
                value={formatAge(liveData.pairCreatedAt, true)}
              />
            </>
          ) : (
            <>
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-20 h-8" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenValue;
