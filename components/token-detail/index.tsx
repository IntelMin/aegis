import React from "react";
import TokenTitle from "./token-title";
import TokenInfo from "./token-info";
import TokenValue from "./token-value";

type Props = {};

const TokenDetail = (props: Props) => {
  return (
    <div className="px-10 flex flex-col gap-9 mt-12">
      <div className="grid grid-cols-4 gap-6">
        {/* Token Name / Network  */}
        <TokenTitle tokenImgUrl={"/token-icons/token.svg"} tokenName={"OSMO"} tokenNetwork={"Osmosis"} />
        <div className="col-span-3">
          <div className="flex items-center">
            {/* Token Price / Price Details */}
            <TokenValue />
          </div>
        </div>
      </div>
      {/* Token Stats / Graph / Table */}
      <TokenInfo />
    </div>
  );
};

export default TokenDetail;