import Image from "next/image";
import React from "react";

type Props = {
  tokenImgUrl : string;
  tokenName: string;
  tokenNetwork: string;
};

const TokenTitle = ({ tokenImgUrl, tokenName, tokenNetwork }: Props) => {
  return (
    <div className="col-span-1 flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Image
          src={tokenImgUrl}
          alt="token"
          width={32}
          height={32}
        />
        <h1 className="text-neutral-300 text-[24px] leading-[32px] font-600">{tokenName}</h1>
        <h3 className="text-neutral-500 text-[20px] leading-[24px] font-500">{tokenNetwork}</h3>
      </div>
    </div>
  );
};

export default TokenTitle;
