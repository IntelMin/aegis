import Image from "next/image";
import React from "react";

type Props = {
  title: string;
  icon?: boolean;
  subHeader?: boolean;
  iconName?: string;
};

const Title = (props: Props) => {
  return (
    <h1 className={`${props.subHeader ? 'text-[16px]' : 'text-[20px]'} font-semibold text-[#e3e1e1] w-fit flex items-center gap-3`}>
      {props.icon && <img src={`${props.iconName || 'aiIcon'}`} alt="icon" width={30} height={30}/>}
      {props.title}
    </h1>
  );
};

export default Title;
