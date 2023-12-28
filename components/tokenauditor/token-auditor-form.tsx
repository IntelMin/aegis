"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const TokenAuditorForm = (props: Props) => {
  const router = useRouter();
  const [tokenVal, setTokenVal] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(tokenVal);
    router.push(`/tokenaudit/${tokenVal}`)
    setTokenVal("");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-12 w-[400px] -translate-y-12">
      <h1 className="text-neutral-200 text-[24px] font-[600]">Token Auditor</h1>
      <form
        className="flex flex-col items-center justify-center gap-6"
        onSubmit={handleSubmit}
      >
        <input
          placeholder="Enter contract address"
          type="text"
          value={tokenVal}
          onChange={(e) => setTokenVal(e.target.value)}
          className="text-[14px] text-white placeholder:text-neutral-600 border-none outline-none bg-zinc-900 border border-zinc-800 py-2 pl-2 pr-4 gap-2 w-[400px]"
        />
        <button
          type="submit"
          className={`${
            tokenVal === "" ? "bg-[#121F31] text-zinc-400" : "bg-[#0E76FD] text-white"
          } text-[14px] font-[300] px-12 py-[6px] w-[400px] transition-all ease-in duration-150`}
        >
          Submit
        </button>
        <p className="text-neutral-500 text-[12px] text-center">
          Submit token contract address to to get a detailed analysis of the
          token, before making your trade decision.
        </p>
      </form>
    </div>
  );
};

export default TokenAuditorForm;
