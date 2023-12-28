import React from "react";
import TokenInfoSet from "./token-info-set";
import TokenStatCard from "./token-stat-card";
import TokenDescription from "./token-description";
import TokenGaugeChart from "./token-gauge-chart";
import TokenDetailTable from "./token-table";

type Props = {};

const TokenInfo = (props: Props) => {
  return (
    <div className="grid grid-cols-4 gap-6 pb-3">
      <div className="col-span-1 flex flex-col gap-4">
        <TokenInfoSet />
        <TokenStatCard />
        <TokenDescription />
        <TokenGaugeChart />
      </div>
      <div className="col-span-3">
        <TokenDetailTable />
      </div>
    </div>
  );
};

export default TokenInfo;
