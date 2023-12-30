import React from "react";
import { tokenData } from "./demo-token-data";
import Marquee from "react-fast-marquee";

const TokenMarquee = ({marqueeData}:any) => {
  const marqueeContent = marqueeData?.map((token:any, index: number) => (
    <span key={index} className="flex items-center mr-8">
      <img src="/token-icons/token.svg" alt={token.newToken} className="w-4 h-4 mr-2" />

      <span className="text-white">{token.newToken}</span>

      <span className="ml-2 text-white">{parseFloat(token.priceUsd).toFixed(4)}</span>
      <span
        className={`ml-2 ${
          token.priceChange >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {token.change >= 0 ? `+${token.priceChange.toFixed(5)}` : token.priceChange.toFixed(4)}
      </span>
    </span>
  ));
  return (
    <div className="overflow-hidden relative flex">
      <Marquee>{marqueeContent}</Marquee>
    </div>
  );
};

export default TokenMarquee;
