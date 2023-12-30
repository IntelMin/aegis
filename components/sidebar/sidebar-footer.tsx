import React from "react";

type Props = {
  open: number;
};

const SidebarFooter = ({ open }: Props) => {
  return (
    <div className="flex justify-center gap-2 items-center">
      {open === 2 && (
        <p className="text-zinc-400 text-[16px] leading-[24px]">Aegis AI</p>
      )}
      <p className="text-zinc-400 text-[16px] leading-[24px]">V 1.3</p>
    </div>
  );
};

export default SidebarFooter;
