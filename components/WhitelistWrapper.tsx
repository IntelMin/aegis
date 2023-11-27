'use client';
import React,{ReactNode} from 'react';
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getWhitelistStatus } from "./../app/utils/supabaseRequests";
import { UserButton,SignIn } from "@clerk/nextjs";
export function WhitelistWrapper ({children,className}:{children:React.ReactNode,
    className?:string}){
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
        
        return isLoading?(
            <div className="bg-black flex justify-center items-center min-h-screen w-full ">
      <SignIn/>
    </div>
        ):whitelistStatus?(
            <div>
                    {children}
            </div>
        ):(
            <div className="bg-white flex justify-center items-center min-h-screen w-full top-0 z-50 loading-screen">
      <h1 className="text-red-900 font-bold text-3xl">
        Please Get Whitelisted To view the page
      </h1>
      <UserButton afterSignOutUrl="/" />
    </div>
        )
    
}
export default WhitelistWrapper;