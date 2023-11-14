"use client";
import Title from "@/components/title";
import React from "react";
import { Chip } from "@nextui-org/react";

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

  return (
    <div className="flex flex-wrap justify-between w-full gap-3 md:absolute top-[22px] left-[25px] ">
      <div className="flex items-center gap-4">
        <Title title={props?.name} icon iconName={props?.icon_url} />
        <Chip
          color="success"
          className=" rounded-lg py-[3px] px-[6px] text-[12px] font-bold uppercase"
        >
          {props.symbol}
        </Chip>
        <Chip
          color="success"
          className="rounded-lg py-[3px] px-[6px] text-[12px] font-bold"
        >
          {props.type}
        </Chip>
      </div>
    </div>
  );
};

export default TokenHeader;
