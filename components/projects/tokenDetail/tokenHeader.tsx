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

const TokenHeader = (props: Props) => {
  console.log("TokenHeader");
  console.log(props);

  return (
    <div className="flex flex-wrap justify-between w-full gap-3">
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
      <div className="flex gap-4 items-center md:ml-[40px]">
        <div className="bg-[#0068345f] px-3 py-[6px] rounded-lg">
          <h1 className="font-semibold text-[15px] text-default-500">
            {"Security Score"}
          </h1>
          <h3 className="font-semibold text-[18px]">
            87.7 <span className="text-warning">AA</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default TokenHeader;
