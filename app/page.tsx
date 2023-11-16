"use client";

import { Steam } from "@/components/charts/steam";
import CircleGraph from "@/components/circleGraph";
import { RxDashboard } from "react-icons/rx";
import Title from "@/components/title";
import { NavbarWrapper } from "@/components/navbar/navbar";
import { Card } from "@nextui-org/react";
import { MdOutlineMonitorHeart } from "react-icons/md";
import TrendingCards from "@/components/bugBounty/TrendingCards";
import IntroModal from "@/components/intromodal";

export default function Home() {
  return (
    <NavbarWrapper pageTitle={<div></div>}>
      <IntroModal />
      <div className="px-6 mt-4 flex space-x-3 p-2">
        <RxDashboard className="text-[#dbd9d9] text-3xl " />
        <Title title="Dashboard" />
      </div>
      <Card className="bg-opacity-10 w-full md:w-full   pt-2 px-4 ">
        <TrendingCards noBlur />
      </Card>
      <section className="flex p-6 flex-col gap-4 md:flex-row ">
        <Card className=" bg-opacity-50 w-full md:w-1/3">
          <div className="p-4 glassCard rounded-md bg-red-500 flex items-top">
            <span>
              <img className="mr-4 h-[40px] w-[40px]" src="/secure.png" />
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

        <Card className=" bg-opacity-50 w-full md:w-[80%]">
          <span className="flex px-2 pt-4  text-xl ">
            <MdOutlineMonitorHeart className="text-green-400 text-4xl " />
            <p className=" mt-1 ml-1">Live Monitoring</p>
          </span>
          <Steam />
        </Card>
      </section>
      <section className="p-6">
        <Card className="bg-opacity-50"></Card>
      </section>
    </NavbarWrapper>
  );
}
