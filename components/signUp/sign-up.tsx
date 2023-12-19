"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import SignUpDetailForm from "./sign-up-detail";
import GoBack from "../ui/go-back";
import SignUpEmail from "./sign-up-email";
import SignUpIndividualForm from "./sign-up-individual";
import SignUpVcForm from "./sign-up-vc";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import uploadImage from "@/utils/uploadImage";

export type SignInData = {
  email: string,
  password: string,
  passwordConfirmation: string,
  projectname: string,
  website: string,
  tokenAddress: string,
  teleAccount: string,
  projectX: string,
  projectInsta: string,
  role: string,
  // individual
  name: string,
  twitter: string,
  teleId: string,
  about: string,
  // vc
  vcContactName: string,
  vcEmail: string,
  // team
  projectEmail: string,
  logourl: File | null,
  terms: boolean
};

const init: SignInData = {
  email: "",
  password: "",
  passwordConfirmation: "",
  projectname: "",
  website: "",
  tokenAddress: "",
  teleAccount: "",
  projectX: "",
  projectInsta: "",
  role: "",
  // individual
  name: "",
  twitter: "",
  teleId: "",
  about: "",
  // vc
  vcContactName: "",
  vcEmail: "",
  // team
  projectEmail: "",
  logourl: null,
  terms: false
}

const SignUpForm = () => {
  const [next, setNext] = React.useState(1);
  const router = useRouter();
  const [signInData, setSignInData] = useState<SignInData>(init)

  const handleSubmit = async (data: any) => {
    const payload = {
      ...signInData,
      ...data
    }

    if (payload.logourl !== null) {
      await uploadImage(payload.logourl);
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.status === 200) {
        console.log("success");
        toast.success('Sign Up Successfull!')
        router.push("/signin");
      } else {
        toast.error(await res.text())
      }
    } catch (err) {
      if (err) {
        console.log(err); toast.error('Sign Up Failed!')
      }
    }
  }

  const renderFormBasedOnRole = () => {
    switch (signInData['role']) {
      case "builder":
      case "kol":
      case "auditor":
        return (
          <SignUpDetailForm onSubmit={handleSubmit} defaultValues={signInData} />
        );
      case "individual":
      case "admin":
        return (
          <SignUpIndividualForm onSubmit={handleSubmit} defaultValues={signInData} />
        );
      case "vc":
        return (
          <SignUpVcForm onSubmit={handleSubmit} defaultValues={signInData} />
        );
      default:
        setNext(1);
        return null;
    }
  };

  return (
    <div className="col-span-1 h-full overflow-hidden relative">
      <div className="flex items-center justify-center flex-col h-[90%]">
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
                onSubmit={data => {
                  setNext(2)
                  setSignInData(prev => ({...prev, ...data}))
                }}
                defaultValues={signInData}
              />
            )}
+          </motion.div>
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
