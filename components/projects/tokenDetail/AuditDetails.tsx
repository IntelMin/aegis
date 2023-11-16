"use client";

import React from "react";
import CircleGraph from "@/components/circleGraph";
import RadialChart from "@/components/radialChart";
import { Card } from "@nextui-org/react";

type Props = {
  name: string;
  symbol: string;
  address: string;
  circulating_market_cap: string;
  decimals: string;
  exchange_rate: string;
  holders: string;
  icon_url: string;
  total_supply: string;
  type: string;
};

const AuditDetail = (props: any) => {
  const formatLargeNumber = (numberStr: string) => {
    let [integerPart, fractionalPart] = numberStr.split('.');
    fractionalPart = fractionalPart || '0';
    const shift = fractionalPart.length;
    const shiftedNumberStr = integerPart + fractionalPart;
    const number = BigInt(shiftedNumberStr); // This is now a whole number
  
    const scales = [
      { value: BigInt(1e3), symbol: "thousand" },
      { value: BigInt(1e6), symbol: "million" },
      { value: BigInt(1e9), symbol: "billion" },
      { value: BigInt(1e12), symbol: "trillion" },
      { value: BigInt(1e15), symbol: "quadrillion" },
      { value: BigInt(1e18), symbol: "quintillion" },
      { value: BigInt(1e21), symbol: "sextillion" },
      { value: BigInt(1e24), symbol: "septillion" },
    ];

    for (let i = scales.length - 1; i >= 0; i--) {
      const scale = scales[i];
      if (number >= scale.value * BigInt(10 ** shift)) {
        const scaledNumber = number / (scale.value * BigInt(10 ** shift));
        return `${scaledNumber.toString()} ${scale.symbol}`;
      }
    }
    
    return numberStr;
  }

  const total_supply = formatLargeNumber(props.total_supply);
  const market_cap = formatLargeNumber(props.circulating_market_cap);

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="items-center gap-4 mr-4 ">
        <div className="bg-[#2a2a2a52] px-3 py-[6px] rounded-lg mb-5">
          <h1 className="font-semibold text-[13px] text-default-500">
            Current Price ({props.symbol})
          </h1>
          <h3 className="font-semibold text-[18px] text-light">
            ${props.exchange_rate}
          </h3>
          <p className="text-[12px] text-success">+5.35%</p>
        </div>
        <div className="bg-[#2a2a2a52] px-3 py-[6px] rounded-lg mb-5">
          <h1 className="font-semibold text-[13px] text-default-500">
            {"Market Cap"}
          </h1>
          <h3 className="font-semibold text-[18px] text-light">
            ${market_cap}
          </h3>
          <p className="text-[12px] text-success">+7.35%</p>
        </div>

        <div className="bg-[#2a2a2a52] px-3 py-[6px] rounded-lg mb-5">
          <h1 className="font-semibold text-[13px] text-default-500">
            {"Holders"}
          </h1>
          <h3 className="font-semibold text-[18px] text-light">
            {props.holders}
          </h3>
          <p className="text-[12px] text-danger">-0.35%</p>
        </div>

        <div className="bg-[#2a2a2a52] px-3 py-[6px] rounded-lg mb-5">
          <h1 className="font-semibold text-[13px] text-default-500">
            {"Supply"}
          </h1>
          <h3 className="font-semibold text-[18px] text-light">
            {total_supply}
          </h3>
          <p className="text-[12px] text-success">+11.35%</p>
        </div>
      </div>
      <Card className="flex flex-col w-full col-span-3 bg-gradient-to-tr from-[#1b1b1bbd] via-[#1b1b1bbd] to-gray-700 mr-4 bg-opacity-50 rounded-lg md:w-1/2 md:col-span-2 justify-left">
        <div className="p-2 pt-4 rounded-md glassCard">
          <div className="px-4">
            <div className="flex items-center justify-between">
              <h1 className="text-light font-bold text-[22px]">
                Audit Details
              </h1>
            </div>
          </div>

          <RadialChart />
        </div>
      </Card>

      <Card className="w-full bg-opacity-50 md:w-1/3 bg-gradient-to-tr from-[#191b1e] via-[#1b1b1bbd] to-gray-700">
        <div className="flex p-4 rounded-md items-top">
          <span>
            <img
              className="mr-4"
              src="https://bankco-next.vercel.app/_next/static/media/total-earn.c13de7d2.svg"
            />
          </span>

          <div className="w-full bg-transparent">
            Audit Details
            <p className="justify-end mt-4 text-4xl font-bold"></p>
            <p className="text-[13px]">
              <span className="text-success ">92% </span>Audit Score
            </p>
            <div className="flex items-center justify-between w-full mt-5">
              <p className="text-[14px]">Audits</p>
              <span className="text-success">1 Available</span>
            </div>
            <div className="flex items-center justify-between w-full mt-2">
              <p className="text-[14px]">Onboarded Date</p>
              <span className="text-success">07-11-2022</span>
            </div>
            <div className="flex items-center justify-between w-full mt-2">
              <p className="text-[14px]">Governance Strength</p>
              <span className="text-success">97.38</span>
            </div>
            <div className="flex items-center justify-between w-full mt-2">
              <p className="text-[14px]">Market Stability</p>
              <span className="text-success">96.22</span>
            </div>
            <div className="flex items-center justify-between w-full mt-2">
              <p className="text-[14px]">Code Security</p>
              <span className="text-success">99.38</span>
            </div>
            <div className="flex items-center justify-between w-full mt-2">
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
