"use client";

import React from "react";
import CircleGraph from "@/components/circleGraph";

type Props = {};

const SecurityScore = (props: Props) => {
  return (
    <div
      className="col-span-3 md:col-span-2 bg-[#2d2d2d8d] rounded-lg flex flex-col justify-between items-stretch h-full"
      style={{
        background:
          "linear-gradient(47deg, rgba(13,21,11,1) 0%, rgba(53,59,46,1) 56%, rgba(36,93,71,1) 100%)",
      }}
    >
      <div className="px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-[#3ab93a] font-bold text-[22px]">
            Security Score
          </h1>
          <span className="text-[32px] font-[700]">#3</span>
        </div>
        <p className="font-[500] text-[14px] text-[#dddcdc]">
          Percentile: <span className="text-success">Top 10%</span>
        </p>
      </div>
      <CircleGraph />
    </div>
  );
};

export default SecurityScore;
