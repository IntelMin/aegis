import Image from 'next/image';
import React from 'react';

type Props = {
  open: number;
  setOpen: (open: number) => void;
};

const SidebarOpenbtn = ({ open, setOpen }: Props) => {
  return (
    <div className="flex items-center justify-center my-6">
      <button
        onClick={() => {
          if (open === 1) setOpen(2);
          else setOpen(1);
        }}
      >
        <Image
          alt="logo"
          src={open === 2 ? '/icons/close.svg' : '/icons/open.svg'}
          width={32}
          height={32}
          className="brightness-50 hover:brightness-[20]"
        />
      </button>
    </div>
  );
};

export default SidebarOpenbtn;
