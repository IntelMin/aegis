import React, { useState } from 'react';
import Image from 'next/image';
import TokenTitle from './token-title';
import TokenValueBox from './token-value-box';
import TokenPrice from './token-price';
import { formatAddress } from '@/utils/format-address';
import { formatNumber } from '@/utils/format-number';
import { formatAge } from '@/utils/format-age';

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
          <TokenTitle
            tokenImgUrl={
              props.metadata?.imageSmallUrl
                ? `/api/token/image?q=${props.metadata?.imageSmallUrl
                    .split('/')
                    .pop()}`
                : `/icons/token-default.svg`
            }
            tokenName={props.metadata?.name}
            tokenNetwork={props.metadata?.symbol}
          />
        </div>

        <div className="flex-1">
          <TokenPrice
            price={`$${props?.liveData?.priceUsd}`}
            profit={props?.liveData?.priceChange.h24}
          />
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
          <TokenValueBox
            name="MCAP"
            value={formatNumber(props?.liveData?.fdv)}
          />
          <TokenValueBox
            name="LIQUIDITY"
            value={formatNumber(props?.liveData?.liquidity.usd)}
          />
          <TokenValueBox
            name="VOL (24H)"
            value={formatNumber(props?.liveData?.volume.h24)}
          />
          <TokenValueBox
            name="AGE"
            value={formatAge(props?.liveData?.pairCreatedAt, true)}
          />
        </div>
      </div>
    </div>
  );
};

export default TokenValue;
