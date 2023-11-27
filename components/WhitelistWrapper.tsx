"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getWhitelistStatus } from "./../app/utils/supabaseRequests";
import { UserButton } from "@clerk/nextjs";

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
    <div className="bg-white flex justify-center items-center min-h-screen w-full top-0 z-50 loading-screen">
      <h1 className="text-red-900 font-bold text-3xl">
        Aegis is currently in closed beta
      </h1>
      <UserButton afterSignOutUrl="/" />
    </div>;
  }

  return (
    <div>{children}</div>
  )
}

export default WhitelistWrapper;
