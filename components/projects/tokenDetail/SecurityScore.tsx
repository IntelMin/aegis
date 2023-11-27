"use client";

import React from "react";
import CircleGraph from "@/components/circleGraph";

type Props = {};

const SecurityScore = (props: Props) => {
  return (
    <div
      className="col-span-3 md:col-span-2 bg-gradient-to-tr from-[#1b1b1bbd] via-[#1b1b1bbd] to-gray-700 rounded-lg flex flex-col justify-between items-stretch h-full"
    >
      <div className="px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[white] font-bold text-[22px]">
            Security Score
          </h1>
          <span className="text-[32px] font-[700]">#3</span>
        </div>
        <p className="font-[500] text-[14px] text-[#dddcdc]">
          Percentile: <span className="text-success">Top 10%</span>
        </p>
      </div>
      {/* <CircleGraph {...props} /> */}
    </div>
  );
};

export default SecurityScore;
