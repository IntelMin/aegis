import React, { InputHTMLAttributes } from "react";
import { FieldErrors } from "react-hook-form";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import clsx from "clsx";
import capitalize from "@/utils/capitalize";
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type?: string;
  label: string;
  isPass?: boolean;
  errors?: FieldErrors;
}

const CustomInput = React.forwardRef<HTMLInputElement, Props>(
  ({ type = "text", label, isPass, errors, ...props }, ref) => {
    const [showPass, setShowPass] = React.useState(false);

    return (
      <div className="flex flex-col w-full gap-2">
        <label
          htmlFor={props.name}
          className="text-[#FAFAFA] text-[14px] font-[400] leading-[20px]"
        >
          {label} <span className="text-[#ff0000]">*</span>
        </label>
        <div className="relative w-full">
          <input
            ref={ref}
            id={props["name"]}
            type={isPass ? (showPass ? "text" : "password") : type}
            {...props}
            className={clsx(
              errors?.[props.name]
                ? "border-[#ff0000] border-[2px]"
                : undefined,
              "bg-[#18181B] w-full px-[10px] py-[5px] rounded-md placeholder:text-[#71717A] outline-black text-white"
            )}
          />
          {isPass && (
            <button
              type="button"
              onClick={() => setShowPass((prev) => !prev)}
              className="absolute top-1/2 -translate-y-1/2 right-[10px] cursor-pointer text-zinc-500"
            >
              {showPass ? <IoMdEyeOff /> : <IoMdEye />}
            </button>
          )}
        </div>
        {errors?.[props.name] && (
          <span className="text-red-800">
            {capitalize(errors[props.name]?.message?.toString()!)}
          </span>
        )}
      </div>
    );
  }
);

export default CustomInput;
