"use client";

import { CollectionProps } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@radix-ui/react-select";
import Image from "next/image";
import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

type DrpdownFilterProps = {
  collections: CollectionProps[];
  chainId: string;
  time: string;
  setChainId: (chainId: string ) => void;
  setTime: (time: string) => void;
};

const DropdownFilter = ({
  collections,
  chainId,
  time,
  setChainId,
  setTime,
}: DrpdownFilterProps) => {
  const tableTypes = ["Trending"];

  const timeArr = ["30MIN", "1HR", "2HR"];

  const timeFilter = [
    // { time: "1MIN", value: "1" },
    // { time: "5MIN", value: "5" },
    // { time: "15MIN", value: "15" },
    // { time: "30MIN", value: "30" },
    { time: "1 hr", value: "60" },
    { time: "4 hr", value: "240" },
    { time: "12 hr", value: "720" },
    { time: "1 day", value: "1D" },
  ];

  const [tableType, setTableType] = useState("Trending");
  const [chainName, setChainName] = useState("Eth");
  const [choosenTime, setChoosenTime] = useState("1 day");
  const [timeType, setTimeType] = useState("30MIN");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown((prevDropdown) =>
      prevDropdown === dropdown ? null : dropdown
    );
  };

  const collectionMap = new Map(collections.map((item) => [item.name, item]));
  const timeMap = new Map(timeFilter.map((item) => [item.time, item]));

  function handleChainChange(value: string) {
    const selectedItem = collectionMap.get(value);
    if (selectedItem) {
      setChainName(selectedItem.name);
      setChainId(""+selectedItem.id);
    }
  }
  function handleTimeChange(value: string) {
    const timeItem = timeMap.get(value);
    if (timeItem) {
      setTime(timeItem.value);
      setChoosenTime(timeItem.time);
    }
  }


  return (
    <div className="relative flex items-center justify-between mt-10 mb-4">
      <div className="text-white">
        <div className="relative min-w-[120px]">
          <button
            className="flex items-center gap-2"
            onClick={() => handleDropdownToggle("trending")}
          >
            <p className="text-neutral-200 text-[20px]">{tableType}</p>
            <p className="w-[12px] h-[12px] rounded-full bg-green-400 animate-pulse"></p>
          </button>
          
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative ">
          <Select onValueChange={handleChainChange}>
            <SelectTrigger className="w-[150px] bg-zinc-900 rounded-[4px] outline-none p-2 text-white">
              <div className="flex items-center justify-between uppercase">
                {chainName}
                <BiChevronDown className="text-neutral-400 text-[28px]" />
              </div>
            </SelectTrigger>
            <SelectContent className="w-[150px] bg-zinc-900 text-white pointer rounded-[4px] h-[400px] overflow-auto">
              <SelectGroup>
                {collections?.map((item, i) => (
                  <SelectItem
                    key={item.name}
                    className="p-2 pl-3 uppercase outline-none cursor-pointer hover:bg-zinc-800"
                    value={item.name}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
        <Select onValueChange={handleTimeChange}>
      <SelectTrigger className="w-[150px] bg-zinc-900 rounded-[4px] outline-none p-2 text-white">
        <div className="flex items-center justify-between ">
          {choosenTime}
          <BiChevronDown className="text-neutral-400 text-[28px]" />
        </div>
      </SelectTrigger>

      <SelectContent className="w-[150px] bg-zinc-900 text-white pointer rounded-[4px] overflow-auto">
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
        <button
          type="button"
          className="flex items-center gap-2 bg-zinc-900 p-2 rounded-[4px]"
        >
          <p className="text-green-400 text-[16px] capitalize">Gain</p>
          <Image
            src="/token-icons/green-link.svg"
            alt="token-icon"
            width={22}
            height={22}
            className="rounded-full"
          />
          <BiChevronDown className="text-neutral-400 text-[28px]" />
        </button>
      </div>
    </div>
  );
};

export default DropdownFilter;