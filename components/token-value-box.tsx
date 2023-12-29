import React from "react";

type Props = {
  item: {
    value: string;
    key: string;
  };
};

const TokenValueBox = ({ item }: Props) => {
  return (
    <div key={item?.key} className="bg-zinc-900 px-4 py-[6px] rounded-[6px] overflow-hidden">
      <h1 className="text-neutral-200 text-[16px] font-[600] text-center">
        {item?.value}
      </h1>
      <p className="uppercase text-neutral-500 text-[10px] font-[400] text-center">
        {item?.key}
      </p>
    </div>
  );
};

export default TokenValueBox;
