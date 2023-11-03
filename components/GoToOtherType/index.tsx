import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
    iconName?: string;
    pathName?: string;
    btnName?: string;
};

const GoToOtherType = (props: Props) => {
  return (
    <div
      className="flex flex-col w-full pb-7 md:pb-2 items-center justify-center border px-12 rounded-md h-full bg-opacity-50"
      style={{
        backgroundColor: "#1414149e",
        backgroundImage:
          "linear-gradient(220deg, rgb(87, 87, 87) 0%, rgba(9, 9, 9, 0) 20%, rgba(9, 9, 9, 0) 100%)",
      }}
    >
      <Image alt="imageType" src={`/${props?.iconName ? props.iconName : "code"}.gif`} width={120} height={120} />
      <Link href={`/${props?.pathName ? props?.pathName : 'codeAudit'}`} className="bg-[#51a757] p-2 rounded-lg">
        Go To {props?.btnName ? props?.btnName : "Code"} Audit
      </Link>
    </div>
  );
};

export default GoToOtherType;
