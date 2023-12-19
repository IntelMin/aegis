import React from "react";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";
import Link from "next/link";
import SelectRoles from "../SelectRoles";
import { sign } from "crypto";
import { signIn } from "next-auth/react";

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
    isChecked: boolean;
  }; // Adjust the type according to your data structure
  setSignInData: React.Dispatch<React.SetStateAction<{}>>;
  setNext: React.Dispatch<React.SetStateAction<number>>;
};

const SignUpEmail = ({ signInData, setSignInData, setNext }: Props) => {
  const handleClickNext = () => {
    if (!signInData.email || !signInData.password || !signInData.password2 || !signInData.role || (signInData.password !== signInData.password || !signInData.isChecked)) {
      return;
    }
    setNext(2)
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[375px] max-[450px]:w-[270px] max-[450px]:mx-auto gap-4 flex flex-col">
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
      <div className="flex gap-2 items-center w-[375px] max-[450px]:w-[270px] max-[450px]:mx-auto">
        <input
          type="checkbox"
          style={{ accentColor: "#0E76FD" }}
          className="h-5 w-5"
          checked={signInData.isChecked} // Use the checked attribute to set the checkbox state
          onChange={() => {
            setSignInData((prev) => ({
              ...prev,
              // @ts-ignore
              isChecked: !signInData.isChecked, // Toggle the isChecked value
            }));
          }}
        />


        <p className="text-[#D4D4D4] text-[14px] leading-[20px]">
          <span className="text-[#ff0000]">*</span>By signing up, I accept and agree to the{" "}
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