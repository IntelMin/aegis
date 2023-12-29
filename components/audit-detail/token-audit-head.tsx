import React from "react";
import TokenTitle from "../token-detail/token-title";
import TokenPrice from "../token-price";
import TokenValueBox from "../token-value-box";

type Props = {
  demoarr: {
    value: string;
    key: string;
  }[];
};

const TokenAuditHead = (props: Props) => {
  return (
    <div className="grid grid-cols-11 gap-5 items-center">
      <div className="col-span-6 flex items-center justify-between">
        <TokenTitle
          tokenImgUrl="/aaveIcon.svg"
          tokenName="Aave"
          tokenNetwork="$AAVE"
        />
        <TokenPrice price="$123.97" profit="3.36" />
      </div>
      <div className="col-span-5 flex items-center gap-3">
        {props.demoarr?.map((item) => (
          <TokenValueBox key={item?.key} item={item} />
        ))}
      </div>
    </div>
  );
};

export default TokenAuditHead;
