import React from 'react';

type Props = {
  open: number;
};

const SidebarFooter = ({ open }: Props) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {open === 2 && (
        <p className="text-zinc-400 text-[16px] leading-[24px]">Aegis AI</p>
      )}
      <p className="text-zinc-600 text-[12px] leading-[24px]">v1.3</p>
    </div>
  );
};

export default SidebarFooter;
