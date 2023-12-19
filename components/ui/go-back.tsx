import React from "react";

type Props = {
  setNext: React.Dispatch<React.SetStateAction<number>>;
};

const GoBack = ({ setNext }: Props) => {
  return (
    <button
      type="button"
      onClick={() => setNext(1)}
      className="absolute top-[20px] left-[20px] text-[white]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-move-left"
      >
        <path d="M6 8L2 12L6 16" />
        <path d="M2 12H22" />
      </svg>
    </button>
  );
};

export default GoBack;
