import React from "react";
import SignInForm from "@/components/signIn/sign-in";
import Template from "@/components/signIn/template";

type Props = {};

const SignIn = (props: Props) => {
  return (
    <div className="flex items-center justify-center bg-black w-screen h-screen">
      <div className="grid grid-cols-2 w-full h-full">
        <SignInForm />
        <Template />
      </div>
    </div>
  );
};

export default SignIn;
