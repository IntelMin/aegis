import Image from "next/image";
import React from "react";

type Props = {
  name?: string;
  imgUrl?: string;
  security?: string;
  maxReward?: string;
  lastUpdated?: string;
  assests?: string;
  noBlur?: boolean;
};

const BountyCard = (props: Props) => {
  return (
    <div
      className={`p-3 ${
        props.noBlur ? "" : "blur-[2px]"
      } bg-gradient-to-tr from-[#1b1b1bbd] via-[#1b1b1bbd] to-gray-700 rounded-lg col-span-3 md:col-span-1 relative`}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Image
            src={`${props?.imgUrl}`}
            alt="webmix"
            width={30}
            height={30}
            className="rounded-full"
          />
          <h2 className="font-[600] uppercase text-[20px]">{props?.name}</h2>
        </div>
        <div>
          <h1 className="bg-[#6d6c6c5a] px-2 py-[5px] rounded-md w-fit font-bold">
            {props?.security}
          </h1>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="mt-2">
          <h1 className="text-[12px]">Max Reward</h1>
          <h1 className="text-success text-[24px] font-semibold">
            {props?.maxReward}
          </h1>
          <h1 className="text-[12px]">
            Last Updated{" "}
            <span className="font-semibold">{props?.lastUpdated}</span>
          </h1>
        </div>
        <div className="flex gap-2 items-center text-success-foreground p-2 rounded-md">
          <h1 className="text-[14px]">Assets</h1>
          <p className="text-[16px] font-semibold">{props?.assests}</p>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full rounded-lg z-[99]" />
    </div>
  );
};

export default BountyCard;
