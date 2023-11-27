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
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [whitelistStatus, setWhitelistStatus] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isSignedIn, user, isLoaded } = useUser();
  useEffect(() => {
    console.log("user", user);
    setIsLoading(true);
    if (isSignedIn && isLoaded) {
      const settingUpUser = async () => {
        console.log("fetching", user.id);
        setWhitelistStatus(
          await getWhitelistStatus({
            email: String(user.primaryEmailAddress?.emailAddress),
            user_id: user.id,
          })
        );
        setIsLoading(false);
      };
      settingUpUser();
    }
  }, [isSignedIn]);
  console.log("isLoading", isLoading);
  console.log("whitelisted is", whitelistStatus);

  return isLoading ? (
    <div className="bg-black flex justify-center items-center min-h-screen w-full ">
      <SignIn />
    </div>
  ) : whitelistStatus ? (
    <div>{children}</div>
  ) : (
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
          <span className="font-semibold">AegisAI</span> is currently in
          closed-beta, please wait until you’re invited or until we open up for
          public beta.
        </h1>
      </div>
      <UserButton afterSignOutUrl="/" appearance={{baseTheme: dark}} />
    </div>
  );
}
export default WhitelistWrapper;

// background-color: #4d4855;
