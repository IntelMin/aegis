'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

const PendingContent = (user: any) => {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="w-[20rem] md:w-[22rem]">
      <div className="flex items-center justify-center flex-col h-[90%] px-[10px] mb-8">
        <div className="border border-[#27272A] w-fit p-4 rounded-md mb-3">
          <Image alt="user-icon" src="/icons/user.png" width={20} height={20} />
        </div>
        <h1 className="font-[600] text-[24px] leading-[48px] text-[#FFFFFF]">
          Welcome, {user.user.username}!
        </h1>
        <p className="font-[400] text-[14px] leading-[24px] text-[#A6A6A6]">
          Your account is pending
        </p>
      </div>

      <div className="text-center">
        <p className="pb-2 text-md text-zinc-400">
          Thank you for your interest in Aegis!
        </p>
        <p className="pb-6 text-md text-zinc-400">
          You have been added to the <strong>waitlist</strong>. We will reach
          out to you as soon as we can.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingContent;
