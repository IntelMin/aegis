"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import SignUpDetailForm from "./sign-up-detail";
import GoBack from "../ui/go-back";
import SignUpEmail from "./sign-up-email";
import SignUpIndividualForm from "./sign-up-individual";
import SignUpVcForm from "./sign-up-vc";
import { useForm } from "@/utils/useSignUpForm";
import { Toaster } from "react-hot-toast";

type Props = {};
type SetValueFunction<T> = React.Dispatch<React.SetStateAction<T>>;

const SignUpForm = (props: Props) => {
  const [next, setNext] = React.useState(1);
  const [signInData, setSignInData, handleSubmit] = useForm();

  const renderFormBasedOnRole = () => {
    switch (signInData.role) {
      case "builder":
      case "kol":
      case "auditor":
        return (
          <SignUpDetailForm
            signInData={signInData}
            setSignInData={setSignInData as SetValueFunction<{}>}
          />
        );
      case "individual":
      case "admin":
        return (
          <SignUpIndividualForm
            signInData={signInData}
            setSignInData={setSignInData as SetValueFunction<{}>}
          />
        );
      case "vc":
        return (
          <SignUpVcForm
            signInData={signInData}
            setSignInData={setSignInData as SetValueFunction<{}>}
          />
        );
      default:
        setNext(1);
        return null;
    }
  };

  return (
    <div className="col-span-1 min-h-[100%] relative max-[900px]:col-span-2 flex items-center justify-center flex-col gap-[50px]">
      <div className="flex items-center justify-center flex-col ">
        <div className="border border-[#27272A] w-fit p-4 rounded-md mb-3">
          <Image alt="clipboard" src="/clipboard.png" width={20} height={20} />
        </div>
        <h1 className="font-[600] text-[24px] leading-[40px] text-[#FFFFFF]">
          {next === 2 ? "What are you working on" : "We are glad you’re here!"}
        </h1>
        <p className="font-[400] text-[12px] leading-[16px] text-[#A6A6A6] text-center">
          {next === 2
            ? "Let’s provide some info about your project."
            : "Let’s onboard!"}
          <br /> {next === 2 && "we’ll use this data to whitelist you."}
        </p>
        <AnimatePresence initial={false}>
          <form onSubmit={handleSubmit} className="mt-6 mx-[10px] w-full">
            <motion.div
              key={next}
              initial={{ opacity: 0, x: 292 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 1.2, type: "spring" },
              }}
              exit={{ x: -282, transition: { duration: 0.5 } }}
            >
              {next === 2 ? (
                renderFormBasedOnRole()
              ) : (
                <SignUpEmail
                  setNext={setNext}
                  signInData={signInData}
                  setSignInData={setSignInData as SetValueFunction<{}>}
                />
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

      {next === 2 && <GoBack setNext={setNext} />}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default SignUpForm;
