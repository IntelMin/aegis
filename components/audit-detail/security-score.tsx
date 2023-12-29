import React from "react";
import PieGraph from "../piegraph";

type Props = {
    demoSecurityScore: {
        key: string;
        value: string;
    }[]
};

const SecurityScore = ({ demoSecurityScore }: Props) => {
  return (
    <div className="w-full p-6 border border-zinc-900">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <h3 className="text-neutral-200 text-[20px] font-[600]">
          Security Score
        </h3>
        <div className="flex items-center gap-1">
          <p className="text-neutral-200 text-[16px]">Last Audit:</p>
          <span className="text-green-400 text-[16px]">8th Oct, 2023</span>
        </div>
      </div>
      {/* Chart & Other Detail */}
      <div className="w-full flex items-center justify-between border-b border-zinc-900 pb-3">
        <PieGraph value={30} height={280} />
        <div className="flex flex-col gap-4 w-1/2">
          {demoSecurityScore?.map((item) => (
            <div className="flex items-center justify-between" key={item?.key}>
              <p className="text-neutral-400 text-[14px]">{item?.key}</p>
              <p className="text-neutral-200 text-[14px]">{item?.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full justify-end flex items-end pt-4">
        <div className="flex items-center gap-1">
          <p className="text-neutral-200 text-[16px]">Percentile</p>
          <p className="text-green-400 text-[16px]">Top 10%</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityScore;
