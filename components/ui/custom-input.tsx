import React, { useState } from "react";

type Props = {
  name: string;
  placeholder: string;
  type: string;
  label: string;
  isPass?: boolean;
  setShowPass?: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<{}>>;
  required?: boolean;
};

const CustomInput = ({
  name,
  placeholder,
  type,
  label,
  isPass,
  setShowPass,
  value,
  setValue,
  required = false
}: Props) => {
  const [typed, setTyped] = useState<boolean>(false)
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor="email" className="text-[#FAFAFA] text-[14px] font-[400] leading-[20px]">
        {label} <span className="text-[#ff0000]">*</span>
      </label>
      <div className="relative w-full">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={`${placeholder}`}
          value={value}
          required={required}
          onChange={(e) => {
            setTyped(true)
            setValue((prev) => ({
              ...prev,
              [name]: e.target.value,
            }))
          }
          }
          className={`${typed && required && !value && 'border-[#ff0000] border-[2px]'} bg-[#18181B] w-full px-[10px] py-[5px] rounded-md placeholder:text-[#71717A] outline-black text-white`}
        />


        {isPass && setShowPass && (
          <button
            type="button"
            onClick={() => setShowPass((prev) => !prev)}
            className="absolute top-1/2 -translate-y-1/2 right-[10px] cursor-pointer"
          >
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.33301 8.5C1.33301 8.5 3.33301 3.83333 7.99967 3.83333C12.6663 3.83333 14.6663 8.5 14.6663 8.5C14.6663 8.5 12.6663 13.1667 7.99967 13.1667C3.33301 13.1667 1.33301 8.5 1.33301 8.5Z"
                stroke="#737373"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10.5C9.10457 10.5 10 9.60457 10 8.5C10 7.39543 9.10457 6.5 8 6.5C6.89543 6.5 6 7.39543 6 8.5C6 9.60457 6.89543 10.5 8 10.5Z"
                stroke="#737373"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
