"use client";
import { Steam } from "@/components/charts/steam";
import CircleGraph from "@/components/circleGraph";
import { MdOutlineMonitorHeart, MdSecurity } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import Title from "@/components/title";
import { NavbarWrapper } from "@/components/navbar/navbar";
import { Button, Card } from "@nextui-org/react";
import TrendingCards from "@/components/bugBounty/TrendingCards";
import IntroModal from "@/components/intromodal";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getWhitelistStatus } from "./utils/supabaseRequests";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import LiveMetric from "@/components/liveMonitoring/LiveMetric";
import { CiLocationArrow1 } from "react-icons/ci";
import { useNewTokens } from "@/utils/useNewTokens";
import { useDashboardData } from "@/utils/useDashboard";
import DashboardStatsCard from "@/components/Dashboard/DashboarStastCard";

export default function Home() {
  const [whitelistStatus, setWhitelistStatus] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isSignedIn, user, isLoaded } = useUser();

  const newTokens = useNewTokens();
  const dashboardData = useDashboardData();

  useEffect(() => {
    setIsLoading(true);
  
    if (isSignedIn && isLoaded) {
      getWhitelistStatus({
        email: String(user.primaryEmailAddress?.emailAddress),
        user_id: user.id,
      }).then((ws) => {
        setWhitelistStatus(ws)
        setIsLoading(false);
      })
    }
  }, [isSignedIn, isLoaded]);

  if (isLoading) {
    return (
      <div className="bg-black flex justify-center items-center min-h-screen w-full top-0 z-50 loading-screen">
        <h1 className="text-light font-bold text-3xl">Loading...</h1>
      </div>
    )    
  }

  if (!whitelistStatus) {
    <div className="bg-white flex justify-center items-center min-h-screen w-full top-0 z-50 loading-screen">
      <h1 className="text-red-900 font-bold text-3xl">
        Aegis is currently in closed beta
      </h1>
      <UserButton afterSignOutUrl="/" />
    </div>
  }

  return (
    <NavbarWrapper pageTitle={<div></div>}>
      <IntroModal />
      <div className="px-6 mt-4 flex space-x-3 p-2">
        <RxDashboard className="text-[#dbd9d9] text-3xl " />
        <Title title="Dashboard" />
      </div>
      <div className="ml-5 mt-4 mb-4">
        <Title subHeader title="Statistics" />
        <div className="mt-2 mb-2 ml-2 flex">
          {Object.entries(dashboardData).map(([key, value]) => (
            <DashboardStatsCard key={key} data={{ [key]: value }} />
          ))}
        </div>
      </div>
      <Card className="bg-opacity-10 w-full md:w-full pt-2 px-4 liveDash">
        <Title subHeader title="Live Monitoring" />
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-full z-[5] liveOverLay">
            <Link
              href="liveMonitoring"
              className="flex items-center gap-2 text-white font-[500] rounded-lg p-2 pl-4 bg-gradient-to-r from-[#1a1a1ad0] via-[#383838] to-gray-700"
            >
              Show More <CiLocationArrow1 className="font-[500]" />
            </Link>
          </div>
          <LiveMetric data={newTokens} dash />
        </div>
      </Card>
      <Card className="bg-opacity-10 w-full md:w-full pt-2 px-4 cursor-pointer">
        <TrendingCards />
      </Card>
      <section className="flex p-6 flex-col gap-4 md:flex-row hidden">
        <Card className=" bg-opacity-50 w-full md:w-1/3">
          <div className="p-4 glassCard rounded-md bg-red-500 flex items-top">
            <span>
              <MdSecurity className="mr-4 h-[40px] w-[40px]" />
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
          <CircleGraph value={91} height={280} />
          <div className="px-8 flex justify-center items-center mt-5 ">
            <Link href="/security">
              <Button className="bg-transparent border-white border-1 hover:bg-white hover:text-black">
                View More
              </Button>
            </Link>
          </div>
        </Card>

        <Card className=" bg-opacity-50 w-full md:w-[80%] bg-gradient-to-tl from-[#1b1b1bbd] via-[#1b1b1bbd] to-gray-700">
          <Link href="/liveMonitoring">
            <span className="flex px-2 pt-4  text-lg ">
              <MdOutlineMonitorHeart className="text-white mr-4 h-[40px] w-[40px]" />
              <p className=" mt-1 ml-1">Live Monitoring</p>
            </span>
            <Steam />
          </Link>
        </Card>
      </section>
    </NavbarWrapper>
  )
}
