import Image from "next/image";
import React from "react";

type Props = {
    title: string;
};

const TokenInfoKey = ({ title }: Props) => {
  return (
    <div className="flex gap-[4px] items-center">
      <p className="text-neutral-500 text-[12px]">{title}</p>
      <Image
        src="/token-icons/info-icon.svg"
        alt="info-icon"
        width={13}
        height={13}
      />
    </div>
  );
};

export default TokenInfoKey;
