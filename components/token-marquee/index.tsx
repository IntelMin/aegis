import React from "react";
import { tokenData } from "./demo-token-data";
import Marquee from "react-fast-marquee";

const TokenMarquee = () => {
  const marqueeContent = tokenData.map((token) => (
    <span key={token.name} className="flex items-center mr-8">
      <img src={token.icon} alt={token.name} className="w-4 h-4 mr-2" />

      <span className="text-white">{token.name}</span>

      <span className="ml-2 text-white">{token.price}</span>
      <span
        className={`ml-2 ${
          token.change >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {token.change >= 0 ? `+${token.change}` : token.change}
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
