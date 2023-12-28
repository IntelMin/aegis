"use client";

import Image from "next/image";
import React from "react";
import copy from 'copy-to-clipboard';
import ChartTd from "./chart-td";

//! Shift to types folder
type Token = {
  iconSrc: string;
  iconAlt: string;
  name: string;
  fullName: string;
  address: string;
};

type MarketData = {
  time: string;
  token: Token;
  tax: string;
  price: string;
  mCap: {
    total: string;
    available: string;
  };
  maxBuy: string;
  liquidity: {
    value: string;
    units: string;
  };
  rate30min: string;
  rate1hr: string;
  rate4hr: string;
};

type Props = {
  item: MarketData;
  index: number;
};

const TableRow = ({ item, index }: Props) => {

  const handleCopy = (data: string) => {
    copy(data);
  }

  return (
    <tr
      key={index}
      className={`${index % 2 === 0 ? "bg-zinc-900" : ""} grid grid-cols-16 py-2 px-[3px] text-[14px] items-center`}
    >
      {/* time */}
      <td className={`text-neutral-100 col-span-1`}>{item.time}</td>
      {/* token */}
      <td className={`text-neutral-200 col-span-3`}>
        <div className="flex items-center gap-[6px]">
          <Image
            src={item.token.iconSrc}
            alt={item.token.iconAlt}
            width={28}
            height={28}
            className="rounded-full"
          />
          <div className="flex flex-col p-0 m-0">
            <div className="flex items-center gap-1">
              <h1 className="text-[16px] text-neutral-200 uppercase">
                {item.token.name}
              </h1>
              <p className="text-[13px] text-neutral-500 capitalize">
                {item.token.fullName}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-[13px] text-blue-400">{item.token.address}</p>
              <button type="button" onClick={() => handleCopy(item.token.address)}>
                <Image
                  src="/token-icons/blue-copy.svg"
                  alt="copy-icon"
                  width={12}
                  height={12}
                />
              </button>
            </div>
          </div>
        </div>
      </td>
      {/* tax */}
      <td className={`text-neutral-400 col-span-1`}>{item.tax}</td>
      {/* price */}
      <td className={`text-neutral-300 col-span-1`}>{item.price}</td>
      {/* chart */}
      <td className={`text-neutral-200 col-span-2`}>
        <ChartTd />
      </td>

      {/* m-cap */}
      <td className={`text-neutral-200 col-span-2`}>
        <div className="flex flex-col p-0 m-0">
          <p className="text-[13px] text-neutral-300">{item.mCap.total}</p>
          <p className="text-[13px] text-neutral-500">{item.mCap.available}</p>
        </div>
      </td>
      {/* max-buy */}
      <td className={`text-blue-400 col-span-1`}>{item.maxBuy}</td>
      {/* liquidity */}
      <td className={`text-neutral-200 col-span-2`}>
        <div className="flex flex-col p-0 m-0">
          <p className="text-[13px] text-neutral-300">{item.liquidity.value}</p>
          <p className="text-[13px] text-neutral-500">{item.liquidity.units}</p>
        </div>
      </td>
      {/* 30min */}
      <td className={`col-span-1 text-red-500`}>{item.rate30min}</td>
      {/* 1hr */}
      <td className={`text-green-400 col-span-1`}>{item.rate1hr}</td>
      {/* 4hr */}
      <td className={`text-green-400 col-span-1`}>{item.rate4hr}</td>
    </tr>
  );
};

export default TableRow;
