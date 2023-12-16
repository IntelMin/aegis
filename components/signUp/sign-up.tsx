"use client";

import Image from "next/image";
import React from "react";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";
import Link from "next/link";

type Props = {};
type SetValueFunction<T> = React.Dispatch<React.SetStateAction<T>>;

const SignUpForm = (props: Props) => {
  const [next, setNext] = React.useState(false);
  const [signInData, setSignInData] = React.useState({
    email: "",
    projectname: "",
    website: "",
    tokenAddress: "",
    teleAccount: "",
    projectX: "",
    projectInsta: "",
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(signInData);
    setSignInData({
      email: "",
      projectname: "",
      website: "",
      tokenAddress: "",
      teleAccount: "",
      projectX: "",
      projectInsta: "",
    });
  };
  return (
    <div className="col-span-1 flex items-center justify-center flex-col">
      <div className="border border-[#27272A] w-fit p-4 rounded-md mb-3">
        <Image alt="clipboard" src="/clipboard.png" width={20} height={20} />
      </div>
      <h1 className="font-[600] text-[24px] leading-[48px] text-[#FFFFFF]">
        {next ? "What are you working on" : "We are glad you’re here!"}
      </h1>
      <p className="font-[400] text-[14px] leading-[24px] text-[#A6A6A6] text-center">
        {next
          ? "Let’s provide some info about your project."
          : "Let’s onboard!"}
        <br /> {next && "we’ll use this data to whitelist you."}
      </p>
      <form onSubmit={handleSubmit} className="mt-6">
        {next ? (
          <div className="flex flex-col gap-2">
            <div className="w-[380px]">
              <CustomInput
                name="projectname"
                label="Project name"
                placeholder="Example"
                type="text"
                value={signInData?.projectname}
                setValue={setSignInData as SetValueFunction<{}>}
              />
            </div>
            <div className="w-[380px]">
              <CustomInput
                name="website"
                label="Project website"
                placeholder="Https://example.example"
                type="text"
                value={signInData?.website}
                setValue={setSignInData as SetValueFunction<{}>}
              />
            </div>
            <div className="w-[380px]">
              <CustomInput
                name="tokenAddress"
                label="Token address"
                placeholder="0x..."
                type="text"
                value={signInData?.tokenAddress}
                setValue={setSignInData as SetValueFunction<{}>}
              />
            </div>
            <div className="w-[380px]">
              <CustomInput
                name="teleAccount"
                label="Telegram account"
                placeholder="@example"
                type="text"
                value={signInData?.teleAccount}
                setValue={setSignInData as SetValueFunction<{}>}
              />
            </div>
            <div className="w-[380px] grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <CustomInput
                  name="projectX"
                  label="Project’s X"
                  placeholder="@example"
                  type="text"
                  value={signInData?.projectX}
                  setValue={setSignInData as SetValueFunction<{}>}
                />
              </div>
              <div className="col-span-1">
                <CustomInput
                  name="projectInsta"
                  label="Project’s Instagram"
                  placeholder="@example"
                  type="text"
                  value={signInData?.projectInsta}
                  setValue={setSignInData as SetValueFunction<{}>}
                />
              </div>
            </div>
            <CustomSubmitbtn title="Submit" isSignIn />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="w-[380px]">
              <CustomInput
                name="email"
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={signInData?.email}
                setValue={setSignInData as SetValueFunction<{}>}
              />
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                style={{ accentColor: "#0E76FD" }}
                className="h-5 w-5"
              />
              <p className="text-[#D4D4D4] text-[14px] leading-[20px]">
                By signing up, I accept and agree to the{" "}
                <Link href="#" className="text-[#0E76FD]">
                  Terms of Use
                </Link>
                .
              </p>
            </div>
            <CustomSubmitbtn
              title="Continue"
              onClick={() => setNext(true)}
              button
              isSignIn
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default SignUpForm;
