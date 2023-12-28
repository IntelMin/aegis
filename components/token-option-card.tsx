import Image from "next/image";
import React from "react";

type Props = {
  item: {
    btntitle: string;
    about: string;
    imageurl: string;
    premium: boolean;
  };
};

const TokenOptionCard = ({ item }: Props) => {
  const aboutText = item?.about;
  const isTokenPresent = aboutText?.includes("$WIF");
  return (
    <div
      className={`${
        !item?.premium ? "from-[#19191B] to-[#000]" : "from-[#001735] to-[#000]"
      } cursor-pointer group pt-12 bg-gradient-to-b w-[340px] flex items-center justify-between flex-col gap-3 px-4 transition-all ease-in duration-200 border border-zinc-800 min-h-[380px]`}
    >
      <div className="flex flex-col justify-center items-center w-full gap-3">
        <button
          type="button"
          className={`${
            !item.premium
              ? "border-zinc-700 bg-zinc-900"
              : "bg-[#0E76FD] border-[#0E76FD]"
          } text-zinc-50 text-[18px] border font-[400] px-2 h-[40px] w-fit text-center transition-all ease-in duration-200`}
        >
          {item?.btntitle}
        </button>
        <p className="text-neutral-300 font-[14px] text-center">
          {isTokenPresent ? (
            <>
              {aboutText.split("$WIF")[0]}
              <span className="font-bold font-neutral-200">$WIF</span>
              {aboutText.split("$WIF")[1]}
            </>
          ) : (
            aboutText
          )}
        </p>
      </div>
      <Image
        alt="detailed-audit"
        src={`/${item?.imageurl}`}
        width={300}
        height={250}
        className={`${
          !item?.premium ? "grayscale" : "grayscale-0 "
        } transition-all ease-in duration-200`}
      />
    </div>
  );
};

export default TokenOptionCard;
