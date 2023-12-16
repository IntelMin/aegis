import React from "react";
import CustomInput from "../ui/custom-input";
import CustomSubmitbtn from "../ui/custom-submitbtn";
import Link from "next/link";

type Props = {
  signInData: {
    email: string;
    projectname: string;
    website: string;
    tokenAddress: string;
    teleAccount: string;
    projectX: string;
    projectInsta: string;
  }; // Adjust the type according to your data structure
  setSignInData: React.Dispatch<React.SetStateAction<{}>>;
  setNext: React.Dispatch<React.SetStateAction<number>>;
};

const SignUpEmail = ({ signInData, setSignInData, setNext }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[380px]">
        <CustomInput
          name="email"
          label="Email"
          placeholder="Enter your email"
          type="email"
          value={signInData?.email}
          setValue={setSignInData}
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
      <CustomSubmitbtn title="Continue" onClick={() => setNext(2)} button />
    </div>
  );
};

export default SignUpEmail;
