"use client";

import Image from "next/image";
import React from "react";
import copy from "copy-to-clipboard";
import ChartTd from "./chart-td";
import { formatAddress } from "@/utils/FormatAddress";

type TableRowProps = {
  item: any;
  index: number;
};

const TableRow = ({ item, index }: TableRowProps) => {
  const handleCopy = (data: string) => {
    copy(data);
  };

  return (
    <tr
      key={index}
      className={`${
        index % 2 === 0 ? "bg-zinc-900" : ""
      } grid grid-cols-16 py-2 px-[3px] text-[14px] items-center`}
    >
      {/* time */}
      <td className={`text-neutral-100 col-span-2 break-words`}>{item.name}</td>
      {/* token */}
      <td className={`text-neutral-200 col-span-3`}>
        <div className="flex items-center gap-[6px]">
          <Image
            src= { "/token-icons/token.svg" } 
            alt={item.name}
            width={28}
            height={28}
            className="rounded-full"
          />
          <div className="flex flex-col p-0 m-0">
            <div className="flex items-center gap-1">
              <p className="text-[13px] capitalize">{item.symbol}</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-[13px] text-blue-400">
                {formatAddress(item.address)}
              </p>
              <button type="button" onClick={() => handleCopy(item.address)}>
                <Image
                  src= "/token-icons/blue-copy.svg"
                  alt="copy-icon"
                  width={12}
                  height={12}
                />
              </button>
            </div>
          </div>
        </div>
      </td>
      
      {/* price */}
      <td className={`text-neutral-300 col-span-1`}>
        {parseFloat(item.price).toFixed(6)}
      </td>
      {/* chart */}
      <td className={`text-neutral-200 col-span-2 z-[0] relative `}>
        <ChartTd  />
      </td>

      {/* m-cap */}
      <td className={`text-neutral-200 col-span-2`}>
        <div className="flex flex-col p-0 m-0">
          <p className="text-[13px] text-neutral-300">
            {parseFloat(item.marketCap).toFixed(2)}
          </p>
          {/* <p className="text-[13px] text-neutral-500">{item.mCap.available}</p> */}
        </div>
      </td>
      <td className={`text-blue-400 col-span-2`}>{new Date(item.createdAt * 1000).toUTCString()}</td>
      {/* liquidity */}
      <td className={`text-neutral-200 col-span-1`}>
        <div className="flex flex-col p-0 m-0">
          <p className="text-[13px] text-neutral-300">{item.volume}</p>
          <p className="text-[13px] text-neutral-500">{item.liquidity}</p>
        </div>
      </td>
      {/* 30min */}
      <td className={`col-span-1 text-red-500`}>
        {item.priceChange.toFixed(2)} %
      </td>
      {/* 1hr */}
      <td className={`text-green-400 col-span-1`}>
        {item.priceChange1.toFixed(2)} %
      </td>
      {/* 4hr */}
      <td className={`text-green-400 col-span-1`}>
        {/* {item.priceChange12.toFixed(2)} % */}
        <button className="bg-green-700 text-white pl-2 pr-2 pt-1 pb-1 rounded-[4px]">Audit</button>
      </td>
    </tr>
  );
};

export default TableRow;
