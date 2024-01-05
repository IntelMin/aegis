import React from 'react';
import Image from 'next/image';
import TokenTitle from './token-title';
import TokenValueBox from './token-value-box';
import TokenPrice from './token-price';

type Props = {};

const TokenValue = (props: Props) => {
  const demoarr = [
    {
      value: '$8.49M',
      key: 'Market Cap',
    },
    {
      value: '$407.15K',
      key: 'LIQUIDITY',
    },
    {
      value: '$4.28M',
      key: 'VOLUME (24H)',
    },
    {
      value: '$3.82K',
      key: 'HOLDERS',
    },
    {
      value: '231d ago',
      key: 'CREATED',
    },
  ];
  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {/* Token Name / Network  */}
        <TokenTitle
          tokenImgUrl={'/icons/token-default.svg'}
          tokenName={'OSMO'}
          tokenNetwork={'Osmosis'}
        />
        <div className="col-span-3">
          <div className="flex items-center">
            <div className="flex items-center justify-between w-full">
              <TokenPrice price={'$1.16'} profit="3.36" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-3">
                    <p className="text-neutral-100 text-[14px] w-[70px] text-right">
                      OSMO:{' '}
                    </p>
                    <div className="flex items-center gap-[4px]">
                      <p className="text-blue-400 text-[14px] leading-[20px]">
                        0x34e...45rty
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
                        0x34e...45rty
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
                {demoarr?.map(item => (
                  <TokenValueBox key={item?.key} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenValue;
