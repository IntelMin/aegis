"use client";

import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const onSubmit = async (data: { email: any; password: any; }) => {
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
        router.push("/");
      }
    });
  };

  return (
    <div className="col-span-1 h-full max-[900px]:col-span-2 flex items-center justify-center flex-col">
      <div className="flex items-center justify-center flex-col h-[90%] px-[10px]">
        <div className="border border-[#27272A] w-fit p-4 rounded-md mb-3">
          <Image alt="user-icon" src="/user.png" width={20} height={20} />
        </div>
        <h1 className="font-[600] text-[24px] leading-[48px] text-[#FFFFFF]">
          Welcome
        </h1>
        <p className="font-[400] text-[14px] leading-[24px] text-[#A6A6A6]">
          Please enter your account details to sign in.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 mx-[10px] flex flex-col gap-2 w-full">
          <div className="w-full lg:min-w-[375px]">
            <CustomInput
              label="Email"
              placeholder="Enter your email"
              type="email"
              errors={errors}
              {...register("email")}
            />
          </div>
          <div className="w-full lg:min-w-[375px]">
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
