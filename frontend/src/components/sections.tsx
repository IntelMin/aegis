import Image from 'next/image';
import React from 'react';

type Props = {
  sectionsArr: {
    name: string;
    val: string;
  }[];
  showSection: string;
  setShowSection: React.Dispatch<React.SetStateAction<string>>;
};

export const Sections = ({
  sectionsArr,
  showSection,
  setShowSection,
}: Props) => {
  return (
    <div className="grid grid-cols-4 md:hidden items-center pt-5 border-b border-zinc-800">
      <div className="col-span-1 flex items-center gap-1 px-2 mb-3 border-r border-zinc-700 pr-2">
        {/* <Image
          src="/icons/nav/scanner.svg"
          width={18}
          height={18}
          alt="scanner"
        /> */}
        <span
          style={{
            outline: 'none',
            background: 'url(/backgrounds/watchdog.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
          className="text-transparent font-bold text-zinc-200"
        >
          Watchdog
        </span>
      </div>
      {sectionsArr?.map(item => (
        <button
          key={item.val}
          type="button"
          onClick={() => setShowSection(item.val)}
          className={`bg-transparent text-[16px] font-[600] pb-3 px-1 col-span-1 ${
            showSection === item.val
              ? 'text-neutral-50 border-[#2563EB]'
              : 'text-neutral-500 border-transparent'
          } border-b-2 transition-all ease-in duration-200`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
