import React from "react";
import Image from "next/image";
import authbg from "@/public/authbg.png";
import circlelogo from "@/public/circlelogo.png";

type Props = {};
const Template = (props: Props) => {
  return (
    <div
      className="col-span-1 relative py-[96px] pl-[64px] min-h-screen overflow-hidden max-[900px]:hidden"
      style={{
        background:
          "linear-gradient(160deg, #18181B 13.54%, rgba(24, 24, 27, 0.00) 64.41%)",
      }}
    >
      <div>
        <Image alt="circlelogo" src={circlelogo} width={72} height={72} />
      </div>
      <h1 className="z-[6] font-[500] text-[36px] leading-[44px] text-[white] relative pr-[64px]">
        Pioneering Blockchain Security
        <br />
        with AI-Enabled Audit Solutions
      </h1>
      <p className="z-[6] font-[400] text-[14px] leading-[24px] w-[80%] relative text-[#A6A6A6] mt-[16px] pr-[64px]">
        Aegis AI is an AI-powered smart contract auditing tool that empowers end
        users with the ability to assess and enhance the security of their smart
        contracts, even without any coding knowledge.
      </p>
      <div className="relative h-full mt-6">
        <Image
          src={authbg}
          alt="authbg"
          width={500}
          height={700}
          className="absolute bottom-0 right-0 top-0 left-0 w-[650px] h-[full]"
        />
      </div>
    </div>
  );
};

export default Template;