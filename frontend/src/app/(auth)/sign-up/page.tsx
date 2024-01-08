'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import {
  PersonalDataTypes,
  RoleDataTypes,
  SocialDataTypes,
  ProjectDataTypes,
} from '@/components/sign-up/types';
import PersonalDetailsForm from '@/components/sign-up/form-personal';
import RoleDetailsForm from '@/components/sign-up/form-role';
import SocialDetailsForm from '@/components/sign-up/form-socials';
import ProjectDetailsForm from '@/components/sign-up/form-project';
import CompleteForm from '@/components/sign-up/form-complete';
// import uploadImage from '@/utils/uploadImage';

export type SignInData = {
  email: string;
  password: string;
  password2: string;
  project_name: string;
  website: string;
  token_address: string;
  tele_account: string;
  project_x: string;
  project_insta: string;
  role: string;
  // individual
  name: string;
  twitter: string;
  tele_id: string;
  about: string;
  // vc
  vc_contact_name: string;
  vc_email: string;
  // team
  project_email: string;
  logo_url: File | null;
  is_checked: boolean;
};

const init: SignInData = {
  email: '',
  password: '',
  password2: '',
  project_name: '',
  website: '',
  token_address: '',
  tele_account: '',
  project_x: '',
  project_insta: '',
  role: '',
  // individual
  name: '',
  twitter: '',
  tele_id: '',
  about: '',
  // vc
  vc_contact_name: '',
  vc_email: '',
  // team
  project_email: '',
  logo_url: null,
  is_checked: false,
};

const SignUpForm = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [personalData, setPersonalData] = useState<PersonalDataTypes>({
    name: '',
    email: '',
    password: '',
    password2: '',
    bio: '',
  });
  const [roleData, setRoleData] = useState<RoleDataTypes>({ role: 1 });
  const [socialData, setSocialData] = useState<SocialDataTypes>({
    social_twitter: '',
    social_telegram: '',
    social_instagram: '',
    social_discord: '',
  });
  const [projectData, setProjectData] = useState<ProjectDataTypes>({
    project_name: '',
    project_website: '',
    project_telegram: '',
    project_twitter: '',
    project_instagram: '',
    project_discord: '',
    project_logo: '',
  });

  const nextStep = () => {
    setStep((currentStep: number) => currentStep + 1);
  };

  const prevStep = () => {
    setStep((currentStep: number) => Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async (data: any) => {
    // const payload = {
    //   ...signInData,
    //   ...data,
    // };
    // if (payload.logourl !== null) {
    //   payload.logourl = await uploadImage(payload.logourl);
    // }
    // try {
    //   const res = await fetch('/api/signup', {
    //     method: 'POST',
    //     body: JSON.stringify(payload),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   if (res.status === 200) {
    //     console.log('success');
    //     // toast.success('Sign Up Successfull!');
    //     router.push('/signin');
    //   } else {
    //     // toast.error(await res.text());
    //   }
    // } catch (err) {
    //   if (err) {
    //     console.log(err);
    //     // toast.error('Sign Up Failed!');
    //   }
    // }
  };

  // Render form based on the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalDetailsForm
            data={personalData}
            setData={setPersonalData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <RoleDetailsForm
            data={roleData}
            setData={setRoleData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <SocialDetailsForm
            data={socialData}
            setData={setSocialData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        if ([4, 3].includes(roleData.role)) {
          return (
            <ProjectDetailsForm
              data={projectData}
              setData={setProjectData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          );
        }
      case 5: // Assuming step 5 is your finish step
        return (
          <CompleteForm
            personalData={personalData}
            roleData={roleData}
            socialData={socialData}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="col-span-1 min-h-[100%] relative max-[900px]:col-span-2 flex items-center justify-center flex-col gap-[50px]">
      <div className="flex flex-col items-center justify-center ">
        <div className="border border-[#27272A] w-fit p-4 rounded-md">
          <Image
            alt="sign-up"
            src={`/icons/clipboard.png`}
            width={20}
            height={20}
          />
        </div>
        <AnimatePresence initial={false}>
          <div className="mt-6 mx-[10px] w-full min-w-[300px]">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 292 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 1.2, type: 'spring' },
              }}
              exit={{ x: -282, transition: { duration: 0.5 } }}
            >
              {renderStep()}
            </motion.div>
          </div>
        </AnimatePresence>
      </div>

      {step < 2 && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-[14px] font-[400] text-center text-[#d4d4d8d6]">
            Already have an account?
          </p>
          <Link
            href="/login"
            className="text-[#0E76FD] text-[14px] font-[400] text-center "
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;
