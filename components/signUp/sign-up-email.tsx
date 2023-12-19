import React from "react";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import SelectRoles from "../SelectRoles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"
import { SignInData } from "./sign-up";

interface Props {
  onSubmit: (data: any) => void
  defaultValues: SignInData
}

const schema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
    passwordConfirmation: yup.string()
      .oneOf([yup.ref('password'), 'Password must match'], 'Password must match'),
    role: yup.string().required(),
    terms: yup.bool().oneOf([true], 'Field must be checked'),
  })
  .required()

const SignUpEmail: React.FC<Props> = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  })

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-[380px] gap-4 flex flex-col">
        <CustomInput
          label="Email"
          placeholder="Enter your email"
          type="email"
          errors={errors}
          {...register("email")}
        />
        <CustomInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          errors={errors}
          {...register("password")}
        />
        <CustomInput
          label="Confirm Password"
          placeholder="Confirm Password"
          type="password"
          errors={errors}
          {...register("passwordConfirmation")}
        />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <SelectRoles
              onChange={onChange}
              value={value}
            />
          )}
          name="role"
        />
      </div>
      <label className="flex gap-2 items-center text-[#D4D4D4] text-[14px] leading-[20px]">
        <input
          type="checkbox"
          style={{ accentColor: "#0E76FD" }}
          className="h-5 w-5"
          {...register("terms")}
        />
        <span className="text-[#ff0000]">*</span>By signing up, I accept and agree to the{" "}
        <Link href="#" className="text-[#0E76FD]">
          Terms of Use
        </Link>
        .
      </label>
      <CustomSubmitbtn title="Continue" />
    </form>
  )
}

export default SignUpEmail;
