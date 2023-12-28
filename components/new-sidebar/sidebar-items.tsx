import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

type Props = {
  item: {
    name: string;
    href: string;
    iconUrl: string;
    icon: boolean;
  };
  open: number;
};

const SidebarItems = ({ item, open }: Props) => {
  const pathName = usePathname();
  return (
    <Link
      href={`/${item?.href}`}
      className={`hover:border-l-[2px] hover:bg-zinc-900 hover:border-blue-600 transition-all ease-in duration-250 flex items-center gap-2 py-3  ${
        item?.href === `${pathName?.split("/")[1]}`
          ? "border-l-[2px] border-blue-600 bg-zinc-900"
          : ""
      } ${open === 2 ? "px-2" : "px-4"}`}
    >
      {item?.icon && (
        <Image
          alt={item?.iconUrl}
          src={`/nav-icons/${item?.iconUrl}.svg`}
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
              transition: { duration: 0.6, type: "spring" },
            }}
            className={`${
              item?.href === `${pathName?.split("/")[1]}`
                ? "text-white"
                : "text-zinc-500"
            } text-[16px] leading-[24px] cursor-pointer font-300`}
          >
            {item?.name}
          </motion.h1>
        </div>
      )}
    </Link>
  );
};

export default SidebarItems;
