"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";
import SignUpDetailForm from "./sign-up-detail";

type Props = {};
type SetValueFunction<T> = React.Dispatch<React.SetStateAction<T>>;

const SignUpForm = (props: Props) => {
  const [next, setNext] = React.useState(1);
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
    <div className="col-span-1 h-full relative">
      <div className="flex items-center justify-center flex-col h-[90%]">
        <div className="border border-[#27272A] w-fit p-4 rounded-md mb-3">
          <Image alt="clipboard" src="/clipboard.png" width={20} height={20} />
        </div>
        <h1 className="font-[600] text-[24px] leading-[48px] text-[#FFFFFF]">
          {next === 2 ? "What are you working on" : "We are glad you’re here!"}
        </h1>
        <p className="font-[400] text-[14px] leading-[24px] text-[#A6A6A6] text-center">
          {next === 2
            ? "Let’s provide some info about your project."
            : "Let’s onboard!"}
          <br /> {next === 2 && "we’ll use this data to whitelist you."}
        </p>
        <AnimatePresence initial={false}>
          <form onSubmit={handleSubmit} className="mt-6">
            <motion.div
              key={next}
              initial={{ opacity: 0, x: 382 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 1, type: "spring" } }}
              exit={{ x: -382, transition: { duration: 0.25 }, height: 0 }}
            >
              {next === 2 ? (
                <SignUpDetailForm
                  signInData={signInData}
                  setSignInData={setSignInData as SetValueFunction<{}>}
                />
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
                    onClick={() => setNext(2)}
                    button
                  />
                </div>
              )}
            </motion.div>
          </form>
        </AnimatePresence>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-[14px] font-[400] text-center text-[#d4d4d8d6]">
          Already have an account?
        </p>
        <Link
          href="/signin"
          className="text-[#0E76FD] text-[14px] font-[400] text-center"
        >
          Sign In
        </Link>
      </div>

      {next === 2 && (
        <button
          type="button"
          onClick={() => setNext(1)}
          className="absolute top-[20px] left-[20px] text-[white]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-move-left"
          >
            <path d="M6 8L2 12L6 16" />
            <path d="M2 12H22" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SignUpForm;
