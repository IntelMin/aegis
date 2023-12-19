import React, { TextareaHTMLAttributes } from "react";
import { FieldErrors } from "react-hook-form";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  errors?: FieldErrors;
};

const CustomTextarea = React.forwardRef<HTMLTextAreaElement, Props>(({
  placeholder,
  label,
  errors,
  ...props
}, ref) => (
    <>
      <div className="flex flex-col gap-2 w-full">
        <label
          htmlFor={props.name}
          className="text-[#FAFAFA] text-[14px] font-[400] leading-[20px]"
        >
          {label}
        </label>
        <textarea
          placeholder={`${placeholder}`}
          ref={ref}
          id={props.name}
          {...props}
          rows={3}
          style={{ resize: "none" }}
          className={`placeholder:text-[14px] bg-zinc-900 border border-zinc-800 w-full px-[10px] py-[5px] placeholder:text-[#71717A] outline-black text-white`}
        />
      </div>
      {errors?.[props.name] && <span className='text-red-800'>{errors[props.name]?.message?.toString()}</span>}
    </>
  )
);

export default CustomTextarea;
