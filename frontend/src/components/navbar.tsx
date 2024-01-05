'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {};

const NavHeader = (props: Props) => {
  const session = useSession();
  const router = useRouter();
  const [gasPrice, setGasPrice] = React.useState(30.2);

  useEffect(() => {
    const fetchGasPrice = async () => {
      try {
        const res = await fetch(
          'https://api.etherscan.io/api?module=gastracker&action=gasoracle'
        );
        const data = await res.json();

        if (data.message === 'NOTOK') {
          console.log('Rate limit reached, waiting 5 seconds to retry...');
          setTimeout(fetchGasPrice, 5000);
        } else {
          setGasPrice(data.result.ProposeGasPrice);
        }
      } catch (error) {
        console.error('Error fetching gas price:', error);
      }
    };

    fetchGasPrice();
  }, []);

  return (
    <div className="sticky z-[10] w-full top-0 bg-black">
      <header className="flex items-center justify-between px-10 py-3 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900 border border-zinc-800 py-2 pl-2 pr-4 gap-2 min-w-[400px] w-fit">
            <Image src="/icons/search.svg" alt="token" width={28} height={28} />
            <input
              type="text"
              autoComplete="off"
              placeholder="Search or type a command"
              className="w-[80%] text-[14px] text-white placeholder:text-neutral-600 border-none outline-none bg-transparent"
            />
            <div className="flex gap-1 px-2 py-1 bg-black rounded-md">
              <p className="text-white">⌘</p>
              <p className="text-white">F</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/icons/fuel.svg"
              alt="fuel-icon"
              width={24}
              height={24}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <p className="text-green-400 text-[16px] leading-[24px] font-[400]">
                    {gasPrice}
                  </p>
                </TooltipTrigger>
                <TooltipContent>Safe Gas Price: {gasPrice} Gwei</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative bg-zinc-800 p-3 rounded-[4px] flex items-center"
          >
            <Image alt="bell" src="/icons/bell.svg" width={24} height={24} />
            <p className="absolute top-[6px] right-[6px] bg-red-600 text-white rounded-[4px] text-[12px] px-[5px]">
              3
            </p>
          </button>
          <button
            type="button"
            className="bg-zinc-800 p-3 rounded-[4px] flex items-center"
          >
            <Image alt="user" src="/icons/user.png" width={24} height={24} />
          </button>
          {session.status == 'authenticated' ? (
            <button
              type="button"
              className="bg-[#0E76FD] font-[300] text-white px-12 py-3"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              className="bg-[#0E76FD] font-[300] text-white px-12 py-3"
              onClick={() => router.push('/signin')}
            >
              Sign In
            </button>
          )}
        </div>
      </header>
    </div>
  );
};

export default NavHeader;
