import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  item: {
    name: string;
    href: string;
    iconUrl: string;
    icon: boolean;
  };
  open: number;
  setShow?: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarItems = ({ item, open, setShow }: Props) => {
  const pathName = usePathname();
  const isPathAudit =
    item?.href?.split('/')[1] === `${pathName?.split('/')[2]}`;
  const isPathEqualToURL =
    item?.href?.split('/')[0] === `${pathName?.split('/')[1]}`;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/${item?.href}`}
            onClick={() => {
              if (setShow) {
                setShow(false);
              }
            }}
            className={`hover:border-l-[2px] border-l-[2px] pl-3 border-transparent hover:bg-zinc-900 hover:border-blue-600 transition-all ease-in duration-250 flex items-center gap-2 py-3  ${
              (item?.href?.split('/')[0] === 'audit' && isPathAudit) ||
              (isPathEqualToURL && item?.href?.split('/')[0] !== 'audit')
                ? 'border-l-[2px] border-blue-600 bg-zinc-900'
                : ''
            } ${open === 2 ? 'px-2' : 'px-4'}`}
          >
            {item?.icon && (
              <Image
                alt={item?.iconUrl}
                src={`/icons/nav/${item?.iconUrl}.svg`}
                style={
                  (item?.href?.split('/')[0] === 'audit' && isPathAudit) ||
                  (isPathEqualToURL && item?.href?.split('/')[0] !== 'audit')
                    ? {
                        filter: 'invert(100%) brightness(1000%) contrast(100%)',
                      }
                    : {}
                }
                width={18}
                height={18}
              />
            )}
            {open === 2 && (
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ x: -200 }}
                  animate={{
                    x: 0,
                    transition: { duration: 0.6, type: 'spring' },
                  }}
                  className={`${
                    (item?.href?.split('/')[0] === 'audit' && isPathAudit) ||
                    (isPathEqualToURL && item?.href?.split('/')[0] !== 'audit')
                      ? 'text-white'
                      : 'text-zinc-500'
                  } text-[16px] leading-[24px] cursor-pointer font-300`}
                >
                  {item?.name}
                </motion.h1>
              </div>
            )}
          </Link>
        </TooltipTrigger>
        {open === 1 && (
          <TooltipContent
            side="bottom"
            sideOffset={8}
            className="translate-x-4 p-2"
          >
            <p className="text-sm">{item?.name}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarItems;
