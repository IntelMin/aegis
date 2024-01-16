import React from 'react';
import PieGraph from '@/components/analytics/security-pie-chart';

type Props = {
  demoSecurityScore: {
    key: string;
    value: string;
  }[];
};

const SecurityScore = ({ demoSecurityScore }: Props) => {
  return (
    <div className="w-full p-3 md:p-6 border border-zinc-900">
      {/* Title */}
      <div className="flex max-md:flex-col md:items-center justify-between pb-3 border-b border-zinc-900">
        <h3 className="text-neutral-200 text-[20px] font-[600]">
          Security Score
        </h3>
        <div className="flex items-center gap-1">
          <p className="text-neutral-200 text-[16px]">Last Audit:</p>
          <span className="text-green-400 text-[16px]">8th Oct, 2023</span>
        </div>
      </div>
      {/* Chart & Other Detail */}
      <div className="flex max-md:flex-col items-center justify-between w-full pb-3 border-b border-zinc-900">
        {/* <PieGraph value={30} height={280} /> */}
        <div className="flex flex-col w-full md:w-1/2 gap-4">
          {demoSecurityScore?.map(item => (
            <div className="flex items-center justify-between" key={item?.key}>
              <p className="text-neutral-400 text-[14px]">{item?.key}</p>
              <p className="text-neutral-200 text-[14px]">{item?.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-end justify-end w-full pt-4">
        <div className="flex items-center gap-1">
          <p className="text-neutral-200 text-[16px]">Percentile</p>
          <p className="text-green-400 text-[16px]">Top 10%</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityScore;
