"use client";

import { Steam } from "@/components/charts/steam";
import CircleGraph from "@/components/circleGraph";
import ApexChart from "@/components/pieChart";
import Title from "@/components/title";

import { Card } from "@nextui-org/react";

export default function Home() {
  return (
    <>
      <div className="px-6 mt-4">
        <Title title="Dashboard" icon />
      </div>
      <section className="flex p-6 flex-col gap-4 md:flex-row ">
        <Card className=" bg-opacity-50 w-full md:w-1/3">
          <div className="p-4 glassCard rounded-md bg-red-500 flex items-top">
            <span>
              <img
                className="mr-4"
                src="https://bankco-next.vercel.app/_next/static/media/total-earn.c13de7d2.svg"
              />
            </span>

            <div>
              Total Audit Contracts
              <p className="justify-end text-4xl font-bold mt-4">5456+</p>
              <p className="text-[13px]">
                <span className="text-success ">+3.5% </span>from the last week
              </p>
            </div>
          </div>
          <ApexChart />
        </Card>

        <Card className=" bg-opacity-50 w-full md:w-1/3">
          <div className="p-4 glassCard rounded-md bg-red-500 flex items-top">
            <span>
              <img
                className="mr-4"
                src="https://bankco-next.vercel.app/_next/static/media/total-earn.c13de7d2.svg"
              />
            </span>

            <div>
              Security Score
              <p className="justify-end text-4xl font-bold mt-4">#3</p>
              <p className="text-[13px]">
                Percentile
                <span className="text-success "> Top 10% </span>
              </p>
            </div>
          </div>
          <CircleGraph />
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
              Contract Report
              <p className="justify-end text-4xl font-bold mt-4"></p>
              <p className="text-[13px]">
                <span className="text-success ">92% </span>Audit Score
              </p>
              <div className="flex justify-between w-full items-center mt-5">
                <p className="text-[14px]">Fundamental Health</p>
                <span className="text-success">98.80</span>
              </div>
              <div className="flex justify-between w-full items-center mt-2">
                <p className="text-[14px]">Operational Resilience</p>
                <span className="text-success">95.59</span>
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
      </section>

      <Card className="bg-opacity-50 ">
        <div className="glassCard">
          <Steam />
        </div>
      </Card>
    </>
  );
}
