import Image from "next/image";
import React from "react";

type Props = {
  title: string;
  icon: boolean;
  iconName?: string;
};

const Title = (props: Props) => {
  return (
    <h1 className="text-[20px] font-semibold text-[#e3e1e1] w-fit flex gap-3">
      {props.icon && <Image src={`/${props.iconName || 'aiIcon'}.png`} alt="icon" width={30} height={30}/>}
      {props.title}
    </h1>
  );
};

export default Title;
