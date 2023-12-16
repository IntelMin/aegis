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
      className={`mt-3 w-[380px] bg-gradient-to-r from-[#38383896] hover:from-[#0E76FD] via-[#383838] hover:via-[#0E76FD] to-gray-700 hover:to-[#0E76FD] transition-all ease-in-out duration-600 py-[8px] rounded-md font-[400] leading-[20px] text-[16px] text-[#FAFAFA]`}
    >
      {title}
    </button>
  );
};

export default CustomSubmitbtn;
