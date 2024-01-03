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
        {open === 2 ? (
          <Image alt="logo" src="/icons/close.svg" width={32} height={32} />
        ) : (
          <Image alt="logo" src="/icons/open.svg" width={32} height={32} />
        )}
      </button>
    </div>
  );
};

export default SidebarOpenbtn;
