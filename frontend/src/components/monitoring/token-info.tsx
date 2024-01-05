"use client";

import React, { useState } from "react";
import TokenInfoSet from "./token-info-set";
import TokenStatCard from "./token-stat-card";
import TokenDescription from "./token-description";
import TokenGaugeChart from "./token-gauge-chart";
import TokenDetailTable from "./token-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
} from "@radix-ui/react-select";

import { BiChevronDown } from "react-icons/bi";
import TransferVolumeGraph from "./transfer-volume-graph";
import HoldersGraph from "./holders-graph";
import { TopHolding } from "./top-holding";
import { OrderBook } from "./order-book";
import { GraphTypeHeader } from "./graph-type-header";
import CandleStick from "./candle-graph";

type Props = {};

const timeFilter = [
  { time: "6M", value: "6M" },
  { time: "1M", value: "1M" },
  { time: "1W", value: "1W" },
  { time: "1D", value: "1D" },
];

const graphType = [
  { type: "Top Holding Wallet", value: "Top Holding Wallet" },
  { type: "Order Book", value: "Order Book" },
];

const TokenInfo = (props: Props) => {
  const [volumeType, setVolumeType] = useState("Transfer volume");
  const [choosenTime, setChoosenTime] = useState("1D");
  const [choosenType, setChoosenType] = useState("Top Holding Wallet");
  const [time, setTime] = useState("1D"); // Use time in api
  const [walletGraph, setWalletGraph] = useState("Top Holding Wallet"); // Use time in api

  const timeMap = new Map(timeFilter.map((item) => [item.time, item]));
  const graphMap = new Map(graphType.map((item) => [item.type, item]));

  const handleDropdownChange = (value: string) => {
    const timeItem = timeMap.get(value);
    if (timeItem) {
      setTime(timeItem.value);
      setChoosenTime(timeItem.time);
    }
  };

  const handleTypeChange = (value: string) => {
    const walletItem = graphMap.get(value);
    if (walletItem) {
      setWalletGraph(walletItem.value);
      setChoosenType(walletItem.type);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-6 pb-3">
      <div className="col-span-1 flex flex-col gap-4">
        {/* Token Detailed Info */}
        <TokenInfoSet />
        {/* Token Status in Price */}
        <TokenStatCard />
        {/* Token Description */}
        <TokenDescription />
        {/* Token Gauge Chart  */}
        <TokenGaugeChart />
      </div>
      
      <div className="col-span-3">
        {/* candle stick graph */}
        <CandleStick coinName="OSMOS"  />
        {/* Middle Section Graph */}
        <div className="grid grid-cols-3 gap-4">
          {/* Transfer Volume, Holders Graph */}
          <div className="col-span-1 border border-zinc-900 p-2 flex flex-col gap-6 my-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1
                  className={`text-[16px] ${
                    volumeType === "Transfer volume"
                      ? "text-neutral-100"
                      : "text-neutral-600"
                  } transition-all ease-in duration-100 cursor-pointer`}
                  onClick={() => setVolumeType("Transfer volume")}
                >
                  Transfer volume
                </h1>
                <h1
                  className={`text-[16px] ${
                    volumeType === "Holders"
                      ? "text-neutral-100"
                      : "text-neutral-600"
                  } transition-all ease-in duration-100 cursor-pointer`}
                  onClick={() => setVolumeType("Holders")}
                >
                  Holders
                </h1>
              </div>
              <div className="relative z-20">
                <Select onValueChange={handleDropdownChange}>
                  <SelectTrigger className="w-[60px] bg-zinc-900 rounded-[4px] outline-none p-2 py-1 text-white">
                    <div className="flex justify-between items-center text-sm">
                      {choosenTime}
                      <BiChevronDown className="text-neutral-400 text-[28px]" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="w-[60px] bg-zinc-900 text-white pointer rounded-[4px] overflow-auto">
                    <SelectGroup>
                      {timeFilter.map((item, i) => (
                        <SelectItem
                          key={i}
                          className="p-2 pl-3 outline-none cursor-pointer hover:bg-zinc-800"
                          value={item.time}
                        >
                          {item.time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            
            </div>
            {/* Graph Section */}
            {volumeType === "Transfer volume" ? (
              <TransferVolumeGraph />
            ) : (
              <HoldersGraph />
            )}
          </div>
          <div className="col-span-2 border border-zinc-900 p-2 flex flex-col gap-6 my-3 bg-[#0C0C0C]">
            {/* Top Holding Wallets / Order Book */}
            {/* Graph Section */}
            {choosenType === "Top Holding Wallet" ? (
              <TopHolding choosenType={choosenType} handleTypeChange={handleTypeChange} />
            ) : (
              <OrderBook choosenType={choosenType} handleTypeChange={handleTypeChange} />
            )}
          </div>
        </div>
        {/* Token detail in Table format */}
        <TokenDetailTable />
      </div>
    </div>
  );
};

export default TokenInfo;
