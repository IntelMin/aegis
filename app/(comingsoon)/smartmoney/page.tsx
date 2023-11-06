import React from "react";
import ComingSoon from "@/components/comingsoon";

type Props = {};

const SmartMoney = (props: Props) => {
  return (
    <div className="py-4 px-5 w-full h-full flex flex-col gap-4 bg-[#2121219f]">
      <ComingSoon />
    </div>
  );
};

export default SmartMoney;
