import TokenOptionCard from "@/components/token-option-card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type props = {
  params: {
    id: string;
  };
};

const TokenAuditOption = ({ params }: props) => {
  const cardOptionArr = [
    {
      btntitle: "Detailed Audit",
      about:
        "Don’t let hidden bugs hold back your code’s success and maximize your code’s efficiency - let our premium audit report uncover them for you.",
      imageurl: "detailAuditbg.png",
      premium: true,
    },
    {
      btntitle: "Quick Audit",
      about:
        "A handful of information about $WIF token, to help guide your trading decisions ",
      imageurl: "quickAuditbg.png",
      premium: false,
    },
  ];

  return (
    <div className="tokenAuditoptionBg pt-[30px] w-full flex flex-col gap-[72px] items-center justify-center">
      <div className="flex items-center gap-4">
        <h1 className="text-blue-400 text-[16px font-[300] px-4 py-2">
          {params?.id}
        </h1>
        <Link
          href="/tokenaudit"
          className="text-zinc-50 text-[16px] bg-zinc-900 font-[500] py-2 w-[120px] text-center"
        >
          Cancel
        </Link>
      </div>
      <div className="flex flex-col items-center gap-12">
        <div className="flex items-center gap-4">
          <Image src="/tokenuser.svg" alt="token-user" width={40} height={40} />
          <h1 className="text-neutral-50 text-[32px] font-[600]">Dogwifhat</h1>
          <p className="text-neutral-300 text-[24px] font-[400]">$WIF</p>
        </div>
        <div className="flex items-center gap-10">
          {cardOptionArr?.map((item) => (
            <TokenOptionCard key={item?.btntitle} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenAuditOption;
