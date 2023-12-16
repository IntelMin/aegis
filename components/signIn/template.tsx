import React from "react";
import Image from "next/image";
import authbg from "@/public/authbg.png";
import circlelogo from "@/public/circlelogo.png";

type Props = {};

const Template = (props: Props) => {
  return (
    <div className="col-span-1 relative py-[96px] px-[64px]">
      <div>
        <Image alt="circlelogo" src={circlelogo} width={72} height={72} />
      </div>
      <h1 className="z-[6] font-[600] text-[36px] leading-[48px] text-[white]">
        Your Vision, Our dApp,
        <br />
        Building the Ai Future
      </h1>
      <p className="font-[400] text-[14px] leading-[24px] text-[#A6A6A6]">
        [Description]
      </p>
      <Image
        src={authbg}
        alt="authbg"
        width={500}
        height={500}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default Template;
