import Title from "@/components/title";
import React from "react";

type Props = {};

const TokenHeader = (props: Props) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4 items-center">
        <Title title="Token Name" icon iconName="nft" />
        <span className="bg-[#3938387e] rounded-lg py-[3px] px-[6px] text-[12px] font-bold uppercase">
          tkn
        </span>
        <span className="bg-[#3938387e] rounded-lg py-[3px] px-[6px] text-[12px] font-bold">
          Rank: #3
        </span>
      </div>
      <div className="flex gap-4 items-center md:ml-[40px]">
        <div className="bg-[#62646271] px-3 py-[6px] rounded-lg">
          <h1 className="font-semibold text-[13px]">{"Total Price (TKN)"}</h1>
          <h3 className="font-semibold text-[18px] text-success">$0.03144</h3>
        </div>
        <div className="bg-[#62646271] px-3 py-[6px] rounded-lg">
          <h1 className="font-semibold text-[13px] ">{"Market Cap"}</h1>
          <h3 className="font-semibold text-[18px] text-success">$345,523,332</h3>
        </div>
      </div>
    </div>
  );
};

export default TokenHeader;
