"use client";
import React, { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getWhitelistStatus } from "./../app/utils/supabaseRequests";
import { UserButton, SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { baseTheme } from "@rainbow-me/rainbowkit/dist/themes/baseTheme";

export function WhitelistWrapper({
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [whitelistStatus, setWhitelistStatus] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    setIsLoading(true);

    if (isSignedIn && isLoaded) {
      getWhitelistStatus({
        email: String(user.primaryEmailAddress?.emailAddress),
        user_id: user.id,
      }).then((ws) => {
        setWhitelistStatus(ws);
        setIsLoading(false);
      });
    }
  }, [isSignedIn, isLoaded]);

  if (isLoading) {
    return (
      <div className="bg-black flex justify-center items-center min-h-screen w-full top-0 z-50 loading-screen">
        <h1 className="text-light font-bold text-3xl">Loading...</h1>
      </div>
    );
  }

  if (!whitelistStatus) {
    return (
    <div
      style={{
        backgroundImage: "linear-gradient(27deg, #4d4f55 0%, #000000 79%)",
      }}
      className="flex flex-col justify-center items-center min-h-screen w-full top-0 z-50 loading-screen"
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
          is currently in closed-beta,
          please wait until you’re invited or
          we open up for public beta.
        </h1>
      </div>
      <UserButton afterSignOutUrl="/" appearance={{baseTheme: dark}} />
    </div>)
  }

  return (
    <div>{children}</div>
  )
}

export default WhitelistWrapper;
