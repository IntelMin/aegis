import React from "react";
import Link from "next/link";
import { AiOutlineLock } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";

type Props = {};

const ComingSoon = (props: Props) => {
  return (
    <>
      <Link href={"/"} className="flex items-center gap-4">
        <BsArrowLeft />
        Home
      </Link>
      <div className="w-[100%] h-full flex flex-col justify-center items-center">
        <div className="w-[350px] h-[200px] flex flex-col justify-center items-center rounded-[16px]">
          <button
            disabled
            className="bg-[#215a21] rounded-lg p-3 px-6 flex items-center justify-center gap-4"
          >
            Coming Soon
            <AiOutlineLock />
          </button>
        </div>
      </div>
    </>
  );
};

export default ComingSoon;
