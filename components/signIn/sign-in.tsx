"use client";

import React from "react";
import Image from "next/image";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";

type Props = {};
type SetValueFunction<T> = React.Dispatch<React.SetStateAction<T>>;

const SignInForm = (props: Props) => {
  const [showPass, setShowPass] = React.useState(true);
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(loginData);
    setLoginData({
      email: "",
      password: "",
    });
  };
  return (
    <div className="col-span-1 flex items-center justify-center flex-col">
      <div className="border border-[#27272A] w-fit p-4 rounded-md mb-3">
        <Image alt="user-icon" src="/user.png" width={20} height={20} />
      </div>
      <h1 className="font-[600] text-[24px] leading-[48px] text-[#FFFFFF]">Welcome Back</h1>
      <p className="font-[400] text-[14px] leading-[24px] text-[#A6A6A6]">
        Please enter your account details to sign in.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2">
        <div className="w-[300px]">
          <CustomInput
            name="email"
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={loginData?.email}
            setValue={setLoginData as SetValueFunction<{}>}
          />
        </div>
        <div className="w-[300px]">
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
  );
};

export default SignInForm;
