"use client";

import React, { use } from "react";
import Image from "next/image";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

type Props = {};
type SetValueFunction<T> = React.Dispatch<React.SetStateAction<T>>;

const SignInForm = (props: Props) => {
  const [showPass, setShowPass] = React.useState(true);
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(loginData);
    await signIn("credentials", {
      email: loginData.email,
      password: loginData.password,
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

    setLoginData({
      email: "",
      password: "",
    });
  };
  return (
    <div className="col-span-1 h-full max-[900px]:col-span-2">
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
        <form onSubmit={handleSubmit} className="mt-6 mx-[10px] flex flex-col gap-2 w-full">
          <div className="w-full lg:min-w-[375px]">
            <CustomInput

              name="email"
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={loginData?.email}
              setValue={setLoginData as SetValueFunction<{}>}
            />
          </div>
          <div className="w-full lg:min-w-[375px]">
            <CustomInput
              name="password"
              label="Password"
              placeholder="Enter your password"
              type={showPass ? "password" : "text"}
              isPass
              setShowPass={setShowPass}
              value={loginData?.password}
              setValue={setLoginData as SetValueFunction<{}>}
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
