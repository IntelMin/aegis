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
      <h1 className="z-[6] font-[600] text-[36px] leading-[44px] text-[white] relative">
        Pioneering Blockchain Security
        <br />
        with AI-Enabled Audit Solutions
      </h1>
      <p className="z-[6] font-[400] text-[14px] leading-[24px] w-[80%] relative text-[#d1d1d1] mt-[16px]">
        Aegis AI is an AI-powered smart contract auditing tool that empowers end
        users with the ability to assess and enhance the security of their smart
        contracts, even without any coding knowledge.
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
