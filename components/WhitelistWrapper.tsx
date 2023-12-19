"use client";
import React, { useEffect, useState } from "react";
import { getWhitelistStatus } from "./../app/utils/getWhitelistStatus";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/auth";
import { get } from "http";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";
import { redirect } from "next/navigation";

export function WhitelistWrapper({
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [whitelistStatus, setWhitelistStatus] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const session = useSession()
  // console.log({session})
  if(!session?.data?.user?.email){
    redirect("/signin");
  }
  // const [session, setSession] = useState<any>(null);
  useEffect(() => {
    if(session.status=="authenticated" && session.data?.user?.email){
      setIsLoading(true);
      getWhitelistStatus(String(session?.data?.user?.email)).then((res) => {
        setWhitelistStatus(res);
        setIsLoading(false);
      });
    }
  }, [session]);
  // console.log({whitelistStatus})
  if (isLoading) {
    return (
      <div className="top-0 z-50 flex items-center justify-center w-full min-h-screen bg-black loading-screen">
        <h1 className="text-3xl font-bold text-light">Loading...</h1>
      </div>
    );
  }

  if (!whitelistStatus) {
    return (
    <div
      style={{
        backgroundImage: "linear-gradient(27deg, #4d4f55 0%, #000000 79%)",
      }}
      className="top-0 z-50 flex flex-col items-center justify-center w-full min-h-screen loading-screen"
    >
      <div className="bg-gradient-to-r from-[#c6c6c6] via-[#e1dcdc] bg-clip-text to-[white]">
        <h1 className="uppercase font-[800] tracking-[2px] text-[50px] text-transparent">
          THANK YOU!
        </h1>
      </div>
      <div className="bg-gradient-to-r from-[#6f6f6f] via-[#edecec] bg-clip-text to-[#a3a3a3] w-full flex flex-col text-center items-center justify-center mb-3">
        <i className="text-transparent font-medium text-[18px] md:text-[20px] w-[98%] md:w-[70%] text-center">
          Thank you for your interest!
        </i>
        <h1 className="text-transparent font-medium text-[20px] md:text-[24px] max-md:mx-[10px] w-[95%] md:w-[80%] text-center">
          <span className="font-semibold">AegisAI</span>
          &nbsp;is currently in closed-beta,
          please wait until you’re invited or
          we open up for public beta.
        </h1>
        <Button onClick={()=>signOut()} >Sign Out</Button>
      </div>
    </div>)
  }

  return (
    <div>{children}</div>
  )
}

export default WhitelistWrapper;
