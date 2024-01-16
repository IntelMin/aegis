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
    <div className="grid grid-cols-3 md:hidden pt-5 border-b border-zinc-800">
      {sectionsArr?.map(item => (
        <button
          key={item.val}
          type="button"
          onClick={() => setShowSection(item.val)}
          className={`bg-transparent text-[16px] font-[600] pb-3 px-2 col-span-1 ${
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
