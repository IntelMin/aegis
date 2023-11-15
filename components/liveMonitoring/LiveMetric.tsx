import React from "react";
import { AiOutlineAudit } from "react-icons/ai";

type Props = {};

const LiveMetric = (props: Props) => {
  const metric = [
    {
      icon: <AiOutlineAudit className="text-[54px] text-[gray] font-[300]" />,
      title: "Total Audits",
      value: "1932",
    },
    {
      icon: <AiOutlineAudit className="text-[54px] text-[gray] font-[300]" />,
      title: "Total Contracts",
      value: "2902",
    },
    {
      icon: <AiOutlineAudit className="text-[54px] text-[gray] font-[300]" />,
      title: "Total Exploits",
      value: "152",
    },
    {
      icon: <AiOutlineAudit className="text-[54px] text-[gray] font-[300]" />,
      title: "Total Scam",
      value: "123",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2 rounded-md">
      {metric?.map((item, i) => (
        <div key={i} className="blur-[4px] flex items-center gap-3 col-span-1 p-2 bg-[#0b0b0b4c] border border-[#8fba8f75] rounded-md">
          {item?.icon}
          <div className="flex flex-col justify-between">
            <h1 className="text-[15px] text-[#b7b7b7] font-[500]">
              {item?.title}
            </h1>
            <h1 className="text-[22px] text-success font-semibold">{item?.value}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveMetric;
