import React from 'react';

type TokenValueContainerProps = {
  value: string;
  name: string;
};

const TokenValueContainer = ({ value, name }: TokenValueContainerProps) => {
  return (
    <div
      key={name}
      className="bg-zinc-900 px-4 py-[6px] rounded-[6px] overflow-hidden flex-1 flex flex-col items-center justify-center gap-1"
    >
      <h1 className="text-neutral-200 text-[16px] font-[600] text-center">
        {value}
      </h1>
      <p className="uppercase text-neutral-500 text-[10px] font-[400] text-center">
        {name}
      </p>
    </div>
  );
};

export default TokenValueContainer;
