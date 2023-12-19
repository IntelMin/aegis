"use client";

import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required()

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      // callbackUrl: "/",
      redirect: false,
    }).then((res: any) => {
      console.log(res);
      if (res.error) {
        toast.error("Invalid Credentials");
      }
      if (res.ok) {
          redirect("/");
      }
    });
  };

  return (
    <div className="col-span-1 h-full">
      <div className="flex items-center justify-center flex-col h-[90%]">
        <div className="border border-[#27272A] w-fit p-4 rounded-md mb-3">
          <Image alt="user-icon" src="/user.png" width={20} height={20} />
        </div>
        <h1 className="font-[600] text-[24px] leading-[48px] text-[#FFFFFF]">
          Welcome
        </h1>
        <p className="font-[400] text-[14px] leading-[24px] text-[#A6A6A6]">
          Please enter your account details to sign in.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-2">
          <div className="w-[395px]">
            <CustomInput
              label="Email"
              placeholder="Enter your email"
              type="email"
              errors={errors}
              {...register("email")}
            />
          </div>
          <div className="w-[395px]">
            <CustomInput
              label="Password"
              placeholder="Enter your password"
              isPass
              errors={errors}
              {...register("password")}
            />
          </div>
          <CustomSubmitbtn title="Sign In" />
        </form>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-[14px] font-[400] text-center text-[#d4d4d8d6]">
          Don’t you have an account?
        </p>
        <Link
          href="/signup"
          className="text-[#0E76FD] text-[14px] font-[400] text-center"
        >
          Sign Up
        </Link>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default SignInForm;
