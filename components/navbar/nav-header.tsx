"use client"
import { useSession,signOut} from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const NavHeader = (props: Props) => {
  const session = useSession()
  const router = useRouter()
  return (
    <header className="flex py-3 px-10 items-center justify-between border-b border-zinc-900">
      <div className="flex gap-3 items-center">
        <div className="flex bg-zinc-900 border border-zinc-800 py-2 pl-2 pr-4 gap-2 min-w-[400px] w-fit">
          <Image
            src="/token-icons/search.svg"
            alt="token"
            width={28}
            height={28}
          />
          <input
            type="text"
            autoComplete="off"
            placeholder="Search or type a command"
            className="w-[80%] text-[14px] text-white placeholder:text-neutral-600 border-none outline-none bg-transparent"
          />
          <div className="flex gap-1 bg-black px-2 py-1 rounded-md">
            <p className="text-white">⌘</p>
            <p className="text-white">F</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/token-icons/fuel.svg" alt="fuel-icon" width={24} height={24} />
          <p className="text-green-400 text-[16px] leading-[24px] font-[400]">48.1</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative bg-zinc-800 p-3 rounded-[4px] flex items-center"
        >
          <Image alt="bell" src="/token-icons/bell-icon.svg" width={24} height={24} />
          <p className="absolute top-[6px] right-[6px] bg-red-600 text-white rounded-[4px] text-[12px] px-[5px]">3</p>
        </button>
        <button
          type="button"
          className="bg-zinc-800 p-3 rounded-[4px] flex items-center"
        >
          <Image alt="user" src="/user.png" width={24} height={24} />
        </button>
        {session.status=="authenticated" ?(
        <button
          type="button"
          className="bg-[#0E76FD] font-[300] text-white px-12 py-3"
          onClick={()=>signOut()}
        >
          Sign Out
        </button>
        ):(
        <button
          type="button"
          className="bg-[#0E76FD] font-[300] text-white px-12 py-3"
          onClick={()=>router.push("/signin")}
        >
          Sign In
        </button>
        )}
      </div>
    </header>
  );
};

export default NavHeader;
