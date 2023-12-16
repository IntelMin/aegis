import React from "react";

type Props = {
  title: string;
  isSignIn?: boolean;
  button?: boolean;
  onClick?: () => void;
};

const CustomSubmitbtn = ({ title, isSignIn, button, onClick }: Props) => {
  return (
    <button
      type={button ? "button" : "submit"}
      onClick={onClick}
      className={`mt-3 ${
        isSignIn ? "w-[380px]" : "w-[300px]"
      } bg-[#0E76FD] py-[8px] rounded-md font-[400] leading-[20px] text-[16px] text-[#FAFAFA]`}
    >
      {title}
    </button>
  );
};

export default CustomSubmitbtn;
