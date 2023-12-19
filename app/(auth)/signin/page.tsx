import React from "react";
import SignInForm from "@/components/signIn/sign-in";
import Template from "@/components/signIn/template";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";

type Props = {};

const SignIn = async (props: Props) => {
  const authSession = await getServerAuthSession();
  // console.log({authSession});
  if (authSession?.user?.email) redirect("/")
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
