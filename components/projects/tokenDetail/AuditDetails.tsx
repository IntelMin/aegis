"use client";

import React from "react";
import CircleGraph from "@/components/circleGraph";
import RadialChart from "@/components/radialChart";
import { Card } from "@nextui-org/react";


type Props = {};

const AuditDetail = (props: Props) => {
  return (
    <div className="flex">
         <div className=" gap-4 items-center mr-4">
        <div className="bg-[#2a2a2a52] px-3 py-[6px] rounded-lg mb-5">
          <h1 className="font-semibold text-[13px] text-default-500">{"Total Price (TKN)"}</h1>
          <h3 className="font-semibold text-[18px] text-light">$0.03144</h3>
          <p className="text-[12px] text-success">+5.35%</p>
        </div>
        <div className="bg-[#2a2a2a52] px-3 py-[6px] rounded-lg mb-5">
          <h1 className="font-semibold text-[13px] text-default-500">{"Market Cap"}</h1>
          <h3 className="font-semibold text-[18px] text-light">$345,523,332</h3>
          <p className="text-[12px] text-success">+7.35%</p>

        </div>

        <div className="bg-[#2a2a2a52] px-3 py-[6px] rounded-lg mb-5">
          <h1 className="font-semibold text-[13px] text-default-500">{"Holders"}</h1>
          <h3 className="font-semibold text-[18px] text-light">162,587</h3>
          <p className="text-[12px] text-danger">-0.35%</p>

        </div>


        <div className="bg-[#2a2a2a52] px-3 py-[6px] rounded-lg mb-5">
          <h1 className="font-semibold text-[13px] text-default-500">{"Token Transferred (7d)"}</h1>
          <h3 className="font-semibold text-[18px] text-light">162,587</h3>
          <p className="text-[12px] text-success">+11.35%</p>

        </div>



      </div>
        <Card className="col-span-3 bg-opacity-50 mr-4 w-full md:w-1/2 md:col-span-2 rounded-lg flex flex-col justify-left">
      <div className="glassCard rounded-md p-2 pt-4">
      <div className="px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-light font-bold text-[22px]">
            Audit Details
          </h1>
         
        </div>
      </div>

      <RadialChart />
      </div>
    </Card>

<Card className=" bg-opacity-50 w-full md:w-1/3">
<div className="p-4 glassCard rounded-md bg-red-500 flex items-top">
  <span>
    <img
      className="mr-4"
      src="https://bankco-next.vercel.app/_next/static/media/total-earn.c13de7d2.svg"
    />
  </span>

  <div className="w-full">
    Audit Details
    <p className="justify-end text-4xl font-bold mt-4"></p>
    <p className="text-[13px]">
      <span className="text-success ">92% </span>Audit Score
    </p>
    <div className="flex justify-between w-full items-center mt-5">
      <p className="text-[14px]">Audits</p>
      <span className="text-success">1 Available</span>
    </div>
    <div className="flex justify-between w-full items-center mt-2">
      <p className="text-[14px]">Onboarded Date</p>
      <span className="text-success">07-11-2022</span>
    </div>
    <div className="flex justify-between w-full items-center mt-2">
      <p className="text-[14px]">Governance Strength</p>
      <span className="text-success">97.38</span>
    </div>
    <div className="flex justify-between w-full items-center mt-2">
      <p className="text-[14px]">Market Stability</p>
      <span className="text-success">96.22</span>
    </div>
    <div className="flex justify-between w-full items-center mt-2">
      <p className="text-[14px]">Code Security</p>
      <span className="text-success">99.38</span>
    </div>
    <div className="flex justify-between w-full items-center mt-2">
      <p className="text-[14px]">community trust</p>
      <span className="text-success">96.58</span>
    </div>
  </div>
</div>
</Card>
    </div>
  );
};

export default AuditDetail;
