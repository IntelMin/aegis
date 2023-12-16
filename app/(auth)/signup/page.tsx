import Template from '@/components/signIn/template'
import SignUpForm from '@/components/signUp/sign-up'
import React from 'react'

type Props = {}

const SignUpPage = (props: Props) => {
  return (
    <div className="flex items-center justify-center bg-black w-screen h-screen">
      <div className="grid grid-cols-2 w-full h-full">
        <SignUpForm />
        <Template />
      </div>
    </div>
  )
}

export default SignUpPage