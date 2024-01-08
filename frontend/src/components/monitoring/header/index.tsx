import React, { useState } from 'react';
import Image from 'next/image';
import { formatAddress } from '@/utils/format-address';
import { formatNumber } from '@/utils/format-number';
import { formatAge } from '@/utils/format-age';
import TokenValueContainer from './token-value-container';

type Props = {
  showTitle: boolean;
  showPremium: boolean;
  metadata: any;
  liveData: any;
};

const TokenValue = (props: Props) => {
  return (
    <div className="container p-0 mx-auto">
      <div className="flex flex-wrap items-center justify-around gap-4">
        <div className={`${props.showTitle ? '' : 'hidden'} flex-1`}>
          <div className="col-span-1 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <Image
                src={
                  props.metadata?.imageSmallUrl
                    ? `/api/token/image?q=${props.metadata?.imageSmallUrl
                        .split('/')
                        .pop()}`
                    : `/icons/token-default.svg`
                }
                alt="token"
                width={32}
                height={32}
              />
              <h1 className="text-neutral-300 text-[24px] leading-[32px] font-600">
                {props.metadata?.name}
              </h1>
              <h3 className="text-neutral-500 text-[20px] leading-[24px] font-500">
                {props.metadata?.symbol}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-neutral-50 text-[28px] leading-[40px] font-[700]">
              ${props?.liveData?.priceUsd}
            </h1>
            <div className="flex items-center">
              <Image
                src="/icons/profit.svg"
                alt="profit"
                width={7}
                height={7}
              />
              <h5 className="text-green-600">
                {props?.liveData?.priceChange.h24} %
              </h5>
            </div>
          </div>
        </div>

        <div className="flex justify-end flex-1">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <p className="text-neutral-100 text-[14px] w-[70px] text-right">
                {props?.metadata?.symbol}:{' '}
              </p>
              <div className="flex items-center gap-[4px]">
                <p className="text-blue-400 text-[14px] leading-[20px]">
                  {formatAddress(props?.metadata?.address)}
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
                  {props?.liveData?.pairAddress
                    ? formatAddress(props?.liveData?.pairAddress)
                    : null}
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

        <div className="flex flex-row flex-1 gap-2">
          <TokenValueContainer
            name="MCAP"
            value={formatNumber(props?.liveData?.fdv)}
          />
          <TokenValueContainer
            name="LIQUIDITY"
            value={formatNumber(props?.liveData?.liquidity.usd)}
          />
          <TokenValueContainer
            name="VOL (24H)"
            value={formatNumber(props?.liveData?.volume.h24)}
          />
          <TokenValueContainer
            name="AGE"
            value={formatAge(props?.liveData?.pairCreatedAt, true)}
          />
        </div>
      </div>
    </div>
  );
};

export default TokenValue;
