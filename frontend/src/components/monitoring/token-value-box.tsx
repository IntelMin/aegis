import React from 'react';

type Props = {
  value: string;
  name: string;
};

const TokenValueBox = (props: Props) => {
  return (
    <div
      key={props?.name}
      className="bg-zinc-900 px-4 py-[6px] rounded-[6px] overflow-hidden "
    >
      <h1 className="text-neutral-200 text-[16px] font-[600] text-center">
        {props?.value}
      </h1>
      <p className="uppercase text-neutral-500 text-[10px] font-[400] text-center">
        {props?.name}
      </p>
    </div>
  );
};

export default TokenValueBox;
