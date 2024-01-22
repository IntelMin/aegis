import React, { JSXElementConstructor, ReactNode } from 'react';
// import ClusterHold from '../token-analytics/wallets-overview/cluster-hold';
import { IoMdWarning } from 'react-icons/io';
import { LiquidityReportChart } from './liquidity-report-chart';

const LiquidityReport = ({ selected }: any) => {
  return (
    <div>
      <div className="flex max-md:flex-col justify-between gap-4">
        <div className="w-full md:w-[65%]">
          <div className="flex gap-2 justify-between">
            <div className="flex gap-2">
              <h1 className="text-[16px] text-neutral-300 font-[400]">OSMO</h1>
              <h1 className="text-[16px] text-neutral-500 font-[400]">
                {selected}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-white">30% supply</p>
            </div>
          </div>

          <div className="mt-3 p-4">
            <LiquidityReportChart />
          </div>
        </div>
        <div className="bg-zinc-900 text-[12px] text-white">
          {' '}
          <div className="p-2 bg-[#3F2828] opacity-70 border-[1px] flex gap-2 items-center border-red-500">
            <IoMdWarning color="red" /> The top 10 clusters hold 80% of total
            supply.
          </div>
          <div className="p-2">{/* <ClusterHold /> */}</div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityReport;
