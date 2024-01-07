import React from 'react';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-black">
      {/* Sidebar */}
      <main
        className="flex items-center justify-center flex-1"
        style={{ flexBasis: '50%' }}
      >
        <div className="w-full max-w-xs">{children}</div>
      </main>

      {/* Main content */}
      <aside
        className="flex-col hidden pt-24 pl-14 md:flex md:flex-3"
        style={{
          flexBasis: '50%',
          background:
            'linear-gradient(160deg, #18181B 13.54%, rgba(24, 24, 27, 0.00) 64.41%)',
        }}
      >
        <div>
          <Image alt="circlelogo" src={'/logo.png'} width={72} height={72} />
        </div>
        <h1 className="z-[6] pt-5 font-[400] text-[36px] leading-[44px] text-[white] relative pr-[64px]">
          Pioneering Blockchain Security
          <br />
          with AI-Enabled Audit Solutions
        </h1>
        <p className="z-[6] font-[400] text-[14px] leading-[24px] w-[80%] relative text-[#A6A6A6] mt-[16px] pr-[64px] pb-6">
          Aegis AI is an AI-powered smart contract auditing tool that empowers
          end users with the ability to assess and enhance the security of their
          smart contracts, even without any coding knowledge.
        </p>
        <div className="relative h-full mt-6">
          <Image
            src={'/backgrounds/auth.png'}
            alt="auth"
            width={500}
            height={700}
            className="absolute bottom-0 right-0 top-0 left-0 w-[650px] h-[full]"
          />
        </div>
      </aside>
    </div>
  );
}
