"use client";
import Title from "@/components/title";
import React from "react";
import { Chip } from "@nextui-org/react";
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";

type Props = {
  name: string;
  symbol: string;
  address: string;
  circulating_market_cap: string;
  decimals: string;
  exchange_rate: string;
  holders: bigint;
  icon_url: string;
  total_supply: string;
  type: string;
};

const TokenHeader = (props: any) => {
  console.log("TokenHeader");
  console.log(props);
  
  const data = props.token;

  return (
    <div className="flex flex-wrap justify-between w-full gap-3 md:absolute top-[22px] left-[25px] ">
      <div className="flex items-center gap-4">
        <Link href="/codeAudit">
          <IoIosArrowRoundBack className="text-[28px] cursor-pointer md:hidden block ml-2" />
        </Link>
        <Title title={data?.name} icon iconName={data?.icon_url} />
        <Chip className=" rounded-lg py-[3px] px-[6px] text-[12px] font-bold uppercase bg-gradient-to-r from-[#38383896] via-[#383838] to-gray-700">
          {data.symbol}
        </Chip>
        <Chip className="rounded-lg py-[3px] px-[6px] text-[12px] font-bold bg-gradient-to-r from-[#38383896] via-[#383838] to-gray-700">
          {data.type}
        </Chip>
      </div>
    </div>
  );
};

export default TokenHeader;
