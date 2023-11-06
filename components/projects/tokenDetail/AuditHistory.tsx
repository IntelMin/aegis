"use client";

import ApexChart from "@/components/pieChart";
import React from "react";

type Props = {};

const AuditHistory = (props: Props) => {
  return (
    <div
      className="col-span-3 md:col-span-1 bg-[#2d2d2d8d] rounded-lg flex flex-col gap-5 items-stretch h-full pt-2"
      style={{
        background:
          "linear-gradient(47deg, rgba(13,21,11,1) 0%, rgba(53,59,46,1) 56%, rgba(36,93,71,1) 100%)",
      }}
    >
      <div className="px-4">
        <div className="flex justify-between items-center mb-[10px]">
          <h1 className="text-[#3ab93a] font-bold text-[22px]">
            Audit History
          </h1>
        </div>
        <p className="font-[500] text-[14px] text-[#dddcdc]">
          500+ <span className="text-success">+3.5% from the last week</span>
        </p>
      </div>
      <ApexChart detail />
    </div>
  );
};

export default AuditHistory;
