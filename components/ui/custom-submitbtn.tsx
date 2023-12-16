import React from "react";

type Props = {
  title: string;
  button?: boolean;
  onClick?: () => void;
};

const CustomSubmitbtn = ({ title, button, onClick }: Props) => {
  return (
    <button
      type={button ? "button" : "submit"}
      onClick={onClick}
      className={`mt-3 w-[380px] bg-[#0E76FD] py-[8px] rounded-md font-[400] leading-[20px] text-[16px] text-[#FAFAFA]`}
    >
      {title}
    </button>
  );
};

export default CustomSubmitbtn;
