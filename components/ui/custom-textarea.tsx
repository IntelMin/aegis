import React from "react";

type Props = {
  name: string;
  placeholder: string;
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<{}>>;
  required?: boolean;
};

const CustomTextarea = ({
  name,
  placeholder,
  label,
  value,
  setValue,
  required = false,
}: Props) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor="about"
        className="text-[#FAFAFA] text-[14px] font-[400] leading-[20px]"
      >
        {label}
      </label>
      <textarea
        placeholder={`${placeholder}`}
        id={name}
        name={name}
        required={required}
        onChange={(e) =>
          setValue((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        value={value}
        rows={3}
        style={{ resize: "none" }}
        className={`placeholder:text-[14px] bg-zinc-900 border border-zinc-800 w-full px-[10px] py-[5px] placeholder:text-[#71717A] outline-black text-white`}
      />
    </div>
  );
};

export default CustomTextarea;
