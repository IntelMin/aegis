import Image from "next/image";
import React from "react";

type Props = {
    price: string;
    profit: string;
};

const TokenPrice = ({ price, profit }: Props) => {
  return (
    <div className="flex items-center gap-4">
      <h1 className="text-neutral-50 text-[28px] leading-[40px] font-[700]">
        {price}
      </h1>
      <div className="flex items-center">
        <Image
          src="/token-icons/profitIcon.svg"
          alt="profit"
          width={7}
          height={7}
        />
        <h5 className="text-green-600">{profit}%</h5>
      </div>
    </div>
  );
};

export default TokenPrice;
