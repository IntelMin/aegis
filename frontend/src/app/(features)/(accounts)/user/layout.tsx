'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PersonIcon, ArchiveIcon, ReaderIcon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react';
import useBalance from '@/hooks/useBalance';
import Image from 'next/image';
import CountUp from 'react-countup';

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const pathname = usePathname();
  const { balance, isFetchingBalance } = useBalance();

  return (
    <div className="p-8 w-full md:max-w-[75%] m-auto">
      <div className="mb-6 mt-6">
        <h1 className="text-zinc-500 text-xl font-[500] w-[70%]">
          Hello,{' '}
          <span className="text-neutral-200 text-ellipsis">
            {session?.data?.user?.username}
          </span>
        </h1>
      </div>

      {/* Sidebar */}

      <div className="flex max-md:flex-col gap-2">
        <div className="w-[250px] max-md:justify-center max-md:w-full flex flex-col gap-4">
          <div
            style={{
              background: 'url(/backgrounds/balance.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'top center',
            }}
            className="border border-zinc-900 p-4 pb-6 flex flex-col gap-3 items-center justify-center"
          >
            <Image src="/icons/credits.svg" alt="" width={131} height={100} />
            <p className="text-zinc-50 font-[600] text-3xl">
              {!isFetchingBalance ? (
                <CountUp
                  start={0}
                  end={balance ? balance : 0}
                  duration={2.5}
                  separator=","
                  decimals={0}
                  decimal="."
                />
              ) : (
                <>...</>
              )}
            </p>
            <p className="text-zinc-400 font-[400] text-sm">Credit Balance</p>
          </div>
          <nav className="flex md:flex-col max-md:w-full py-2 text-sm font-medium gap-3">
            <Link
              className={`flex max-md:w-1/3 items-center font-[500] justify-center gap-3 px-3 py-2 text-[16px] transition-all  ${
                pathname == '/user/profile'
                  ? 'bg-blue-600 text-zinc-50'
                  : 'bg-zinc-900 text-zinc-600 hover:text-zinc-400'
              }`}
              href="/user/profile"
            >
              <PersonIcon className="text-[36px]" />
              Profile
            </Link>
            <Link
              className={`flex max-md:w-1/3 items-center justify-center font-[500] gap-3 px-3 py-2 text-[16px] transition-all  ${
                pathname == '/user/history'
                  ? 'bg-blue-600 text-zinc-50'
                  : 'bg-zinc-900 text-zinc-600 hover:text-zinc-400'
              }`}
              href="/user/history"
            >
              <Image
                src="/icons/nav/token-audit.svg"
                alt="token-audit"
                width={20}
                height={20}
                style={
                  pathname == '/user/history'
                    ? {
                        filter: 'invert(100%) brightness(1000%) contrast(100%)',
                      }
                    : { filter: 'brightness(50%) contrast(50%)' }
                }
              />
              Audits
            </Link>
            <Link
              className={`flex max-md:w-1/3 items-center justify-center font-[500] gap-3 px-3 py-2 text-[16px] transition-all ${
                pathname == '/user/payments'
                  ? 'bg-blue-600 text-zinc-50'
                  : 'bg-zinc-900 text-zinc-600 hover:text-zinc-400'
              }`}
              href="/user/payments"
            >
              <Image
                src="/icons/purchase.svg"
                alt="token-audit"
                width={20}
                height={20}
                style={
                  pathname == '/user/payments'
                    ? {
                        filter: 'invert(100%) brightness(1000%) contrast(100%)',
                      }
                    : {}
                }
              />
              Payments
            </Link>
          </nav>
        </div>

        <main className="flex flex-1 flex-col gap-4 pt-0 p-4 md:gap-8 md:pt-0 md:p-6">
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
