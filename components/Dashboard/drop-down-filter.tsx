"use client";

import Image from "next/image";
import React from "react";
import { BiChevronDown } from "react-icons/bi";

type Props = {};

const DropdownFilter = (props: Props) => {
  const tableTypes = ["Trending", "New", "Leaderboard"];
  const tokens = [
    {
      name: "Polygon",
      tokenUrl: "/token-icons/token.svg",
    },
    {
      name: "Ethereum",
      tokenUrl: "/token-icons/network-icon.svg",
    },
  ];
  const timeArr = ["30MIN", "1HR", "2HR"];
  const [tableType, setTableType] = React.useState("Trending");
  const [tokenType, setTokenType] = React.useState({
    name: "Polygon",
    tokenUrl: "/token-icons/token.svg",
  });
  const [timeType, setTimeType] = React.useState("30MIN");
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(
    null
  );

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown((prevDropdown) =>
      prevDropdown === dropdown ? null : dropdown
    );
  };

  return (
    <div className="flex items-center justify-between mt-10 mb-4">
      <div className="text-white">
        <div className="relative min-w-[120px]">
          <button
            className="flex items-center gap-2"
            onClick={() => handleDropdownToggle("trending")}
          >
            <p className="text-neutral-200 text-[20px]">{tableType}</p>
            <p className="w-[12px] h-[12px] rounded-full bg-green-400 animate-pulse"></p>
            <BiChevronDown className="text-neutral-400 text-[28px]" />
          </button>
          {activeDropdown === "trending" && (
            <div className="flex flex-col absolute top-full left-0 w-full h-full z-[100] rounded-md">
              {tableTypes?.map((item, i) => (
                <p
                  key={item}
                  onClick={() => {
                    setTableType(item);
                    setActiveDropdown(null);
                  }}
                  className={`text-neutral-200 text-[15px] ${
                    i !== tableTypes?.length - 1
                      ? "border-b border-zinc-500"
                      : ""
                  } p-2 z-[100] cursor-pointer bg-zinc-900 w-full`}
                >
                  {item}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative ">
          <button
            type="button"
            onClick={() => handleDropdownToggle("token")}
            className="flex items-center gap-2 bg-zinc-900 p-2 rounded-[4px]"
          >
            <Image
              src={tokenType?.tokenUrl}
              alt="token-icon"
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="text-neutral-200 text-[16px]">{tokenType?.name}</p>
            <BiChevronDown className="text-neutral-400 text-[28px]" />
          </button>
          {activeDropdown === "token" && (
            <div className="flex flex-col absolute top-full left-0 w-full h-full z-[100] rounded-md">
              {tokens?.map((item, i) => (
                <div
                  className={` ${
                    i !== tokens?.length - 1 ? "border-b border-zinc-500" : ""
                  } flex items-center gap-2 bg-zinc-900 p-2 rounded-[4px] cursor-pointer`}
                  key={item?.name}
                  onClick={() => {
                    setTokenType({
                      name: item?.name,
                      tokenUrl: item?.tokenUrl,
                    });
                    setActiveDropdown(null);
                  }}
                >
                  <Image
                    src={item?.tokenUrl}
                    alt="token-icon"
                    width={18}
                    height={18}
                    className="rounded-full"
                  />
                  <p className="text-neutral-200 text-[14px]">{item?.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => handleDropdownToggle("time")}
            className="flex items-center gap-2 bg-zinc-900 p-2 rounded-[4px]"
          >
            <p className="text-neutral-200 text-[16px] uppercase">{timeType}</p>
            <BiChevronDown className="text-neutral-400 text-[28px]" />
          </button>
          {activeDropdown === "time" && (
            <div className="flex flex-col absolute top-full left-0 w-full h-full z-[100] rounded-md">
              {timeArr?.map((item, i) => (
                <p
                  key={item}
                  onClick={() => {
                    setTimeType(item);
                    setActiveDropdown(null);
                  }}
                  className={`text-neutral-200 text-[13px] ${
                    i !== tableTypes?.length - 1
                      ? "border-b border-zinc-500"
                      : ""
                  } p-2 z-[100] cursor-pointer bg-zinc-900 w-full`}
                >
                  {item}
                </p>
              ))}
            </div>
          )}
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
