import React from 'react';
import { Separator } from '@/components/ui/separator';

type Props = {
  open: number;
  ele: {
    title: string;
  };
};

const SidebarSectionTitle = ({ ele, open }: Props) => {
  return (
    <div className="m-0 p-0">
      {ele?.title !== '' &&
        (open === 2 ? (
          <h1 className="text-zinc-200 text-[16px] font-[400] leading-[24px]">
            {ele?.title}
          </h1>
        ) : (
          //   <h1 className="text-zinc-200 text-center">---</h1>
          <Separator className="w-6 m-auto mb-4" />
        ))}
    </div>
  );
};

export default SidebarSectionTitle;
