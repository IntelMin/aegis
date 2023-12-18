import React from "react";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";
import Link from "next/link";
import SelectRoles from "../SelectRoles";
import { sign } from "crypto";

type Props = {
  signInData: {
    email: string;
    password: string;
    password2: string;
    projectname: string;
    website: string;
    tokenAddress: string;
    teleAccount: string;
    projectX: string;
    projectInsta: string;
    role: string;
  }; // Adjust the type according to your data structure
  setSignInData: React.Dispatch<React.SetStateAction<{}>>;
  setNext: React.Dispatch<React.SetStateAction<number>>;
};

const SignUpEmail = ({ signInData, setSignInData, setNext }: Props) => {
  const handleClickNext = () => {
    if (!signInData.email || !signInData.password || !signInData.password2 || !signInData.role || (signInData.password !== signInData.password2)) {
      return;
    }
    setNext(2)
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="w-[380px] gap-4 flex flex-col">
        <CustomInput
          name="email"
          label="Email"
          placeholder="Enter your email"
          type="email"
          required={true}
          value={signInData?.email}
          setValue={setSignInData}
        />
        <CustomInput
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          required={true}
          value={signInData?.password}
          setValue={setSignInData}
        />
        <CustomInput
          name="password2"
          label="Confirm Password"
          placeholder="Confirm Password"
          type="password"
          required={true}
          value={signInData?.password2}
          setValue={setSignInData}
        />
        {
          signInData.password && signInData.password2 && signInData.password !== signInData.password2 &&
          <p className="text-[#ff0000]">
            Password is not matching
          </p>
        }
        <SelectRoles
          setSignInData={setSignInData}
          signInData={signInData}
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
      <CustomSubmitbtn title="Continue" onClick={handleClickNext} button />
    </div>
  );
};

export default SignUpEmail;
