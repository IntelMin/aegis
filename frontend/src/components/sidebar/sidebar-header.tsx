import Image from 'next/image';
import React from 'react';

type Props = {
  open: number;
};

const SidebarHeader = ({ open }: Props) => {
  return (
    <div className={`${open === 2 ? '' : 'justify-center'} flex gap-2`}>
      <Image alt="logo" src="/logo.png" width={32} height={32} />
      {open === 2 && (
        <h1 className="text-[#D4D4D8] text-[18px] leading-[28px] font-[600]">
          Aegis Ai
        </h1>
      )}
    </div>
  );
};

export default SidebarHeader;
