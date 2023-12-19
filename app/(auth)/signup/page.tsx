import { getServerAuthSession } from '@/app/api/auth/[...nextauth]/auth'
import Template from '@/components/signIn/template'
import SignUpForm from '@/components/signUp/sign-up'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const SignUpPage = async (props: Props) => {
  const authSession = await getServerAuthSession();
  console.log(authSession)
  if (authSession?.user?.email) redirect("/")
  return (
    <div className="flex items-center justify-center bg-black w-screen min-h-screen max-[450px]:py-[30px]">
      <div className="grid grid-cols-2 w-full h-full">
        <SignUpForm />
        <Template />
      </div>
    </div>
  )
}

export default SignUpPage