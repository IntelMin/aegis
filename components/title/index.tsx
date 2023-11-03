import React from "react";

type Props = {
  title: string;
};

const Title = (props: Props) => {
  return (
    <h1 className="text-[20px] font-semibold text-[#e3e1e1] w-fit">
      {props.title}
    </h1>
  );
};

export default Title;
