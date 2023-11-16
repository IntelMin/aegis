import React from "react";
import Image from "next/image";
import { BiSolidUpArrow } from "react-icons/bi";
import Link from "next/link";

type Props = {
  id: string;
};

const Token = (props: Props) => {
  return (
    <Link
      href={`/projects/${props?.id}`}
      className="overflow-hidden col-span-4 md:col-span-1 w-full border border-[#9e9d9d6d] bg-gradient-to-tr from-[#0c0c0cfe] via-[#222222da] to-gray-700 hover:border-[#686868] transition-all hover:scale-[1.04] rounded-md py-4 bg-[#8080807d]"
    >
      <div className="flex items-center justify-between px-4">
        <div className="flex w-full items-center gap-3">
          <Image src={`/projects.png`} alt="icon" width={45} height={45} />
          <div className="flex flex-col">
            <h1 className="font-[600] text-[22px] md:text-[18px]">
              Token Name
            </h1>
            <p className="font-[500] text-[14px] md:text-[12px]">$1.3e-8</p>
          </div>
        </div>
        <div className="flex flex-col gap-[3px] items-center justify-center mt-2">
          <BiSolidUpArrow className="text-[#84dda9]" />
          <p className="text-[#84dda9] text-[12px] font-bold">6.42%</p>
        </div>
      </div>
      <div className="w-full flex items-center justify-between mt-2">
        <div className="flex items-center py-[2px]  mt-3 rounded-lg border border-[#eeededd2] px-3 ml-4">
          <h1 className="font-bold text-success text-[17px] ">
            91.<span className="text-[14px] font-semibold">14</span>
          </h1>
        </div>
        <div className="px-3 mt-3 w-fit rounded-md py-[4px] bg-[#8080804b] flex items-center mr-4">
          <h1 className="font-[700] text-[13px]">Audits: 1</h1>
        </div>
      </div>
    </Link>
  );
};

export default Token;

// background: rgb(13,21,11);
// background: linear-gradient(47deg, rgba(13,21,11,1) 0%, rgba(64,81,40,1) 47%, rgba(196,228,133,1) 100%);
