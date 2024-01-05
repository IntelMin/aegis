import React from 'react';
import TokenTitle from '@/components/monitoring/token-title';
import TokenPrice from '@/components/monitoring/token-price';
import TokenValueBox from '@/components/monitoring/token-value-box';

type Props = {
  demoarr: {
    value: string;
    key: string;
  }[];
};

const TokenAuditHead = (props: Props) => {
  return (
    <div className="grid items-center grid-cols-11 gap-5">
      <div className="flex items-center justify-between col-span-6">
        <TokenTitle
          tokenImgUrl="/aaveIcon.svg"
          tokenName="Aave"
          tokenNetwork="$AAVE"
        />
        <TokenPrice price="$123.97" profit="3.36" />
      </div>
      <div className="flex items-center col-span-5 gap-3">
        {props.demoarr?.map(item => (
          <TokenValueBox key={item?.key} item={item} />
        ))}
      </div>
    </div>
  );
};

export default TokenAuditHead;
