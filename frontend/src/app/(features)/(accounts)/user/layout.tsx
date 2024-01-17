'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PersonIcon, ArchiveIcon, ReaderIcon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react';

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const pathname = usePathname();
  const [balance, setBalance] = React.useState<number>(0);

  useEffect(() => {
    const getBalance = async () => {
      console.log(session?.data?.user?.email);
      const res = await fetch('/api/credit/balance', {
        method: 'POST',
        body: JSON.stringify({
          email: session?.data?.user?.email,
        }),
      });
      const data = await res.json();
      setBalance(data?.balance);
    };
    if (session?.data?.user?.email) {
      getBalance();
    }
  }, [session?.data?.user?.email]);

  return (
    <div className="p-8 w-full max-w-[1200px] m-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="">
          <h1 className="font-semibold text-zinc-500 text-md">Hello,</h1>
          <h1 className="font-semibold text-zinc-200 text-lg">
            {session?.data?.user?.username}
          </h1>
        </div>
        <div>
          <h1 className="font-bold text-md text-green-600 text-right">
            {balance}
          </h1>
          <span className="text-zinc-600 text-xs">Credits</span>
        </div>
      </div>
      <hr className="border-b-1 border-zinc-900 mt-4" />

      {/* Sidebar */}
      <div className="flex max-md:flex-col gap-2">
        <nav className="flex md:flex-col py-5 px-5 border-r border-zinc-900 text-sm font-medium gap-3">
          <Link
            className={`flex items-center gap-3 px-3 py-2 transition-all rounded-lg  ${
              pathname == '/user/profile'
                ? 'bg-zinc-100 text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-400'
            }`}
            href="/user/profile"
          >
            <PersonIcon className="text-2xl" />
            Profile
          </Link>
          <Link
            className={`flex items-center gap-3 px-3 py-2 transition-all rounded-lg  ${
              pathname == '/user/history'
                ? 'bg-zinc-100 text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-400'
            }`}
            href="/user/history"
          >
            <ArchiveIcon className="text-2xl" />
            History
          </Link>
          <Link
            className={`flex items-center gap-3 px-3 py-2 transition-all rounded-lg  ${
              pathname == '/user/payments'
                ? 'bg-zinc-100 text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-400'
            }`}
            href="/user/payments"
          >
            <ReaderIcon className="text-2xl" />
            Payments
          </Link>
        </nav>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}

          {/* <div className="border shadow-sm rounded-lg p-2">
            <h2 className="font-semibold text-lg">Main Content</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              This is where the main content of the page will be displayed.
            </p>
          </div> */}
        </main>
      </div>
    </div>
  );
}
