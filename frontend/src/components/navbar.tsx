'use client';
import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Search from '@/components/search';
import { PersonIcon, ArchiveIcon, ReaderIcon } from '@radix-ui/react-icons';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

type Props = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavHeader = ({ show, setShow }: Props) => {
  const session = useSession();
  // console.log(session?.data?.user);
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

  const getGasPriceColor = () => {
    if (gasPrice < 30) {
      return 'text-green-400';
    } else if (gasPrice >= 30 && gasPrice <= 49) {
      return 'text-orange-400';
    } else {
      return 'text-red-400';
    }
  };

  return (
    <div className="sticky z-[10] w-full top-0 bg-black">
      <header
        className="flex py-3 px-4 md:px-10 items-center justify-between border-b border-zinc-800"
        suppressHydrationWarning={true}
      >
        <div className="flex items-center gap-3">
          <button className="md:hidden">
            <Image src="/logo.png" alt="logo" width={40} height={40} />
          </button>
          <Search />
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
                  <p
                    className={`${getGasPriceColor()} text-[16px] leading-[24px] font-[400]`}
                  >
                    {gasPrice}
                  </p>
                </TooltipTrigger>
                <TooltipContent>Safe Gas Price: {gasPrice} Gwei</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative bg-zinc-800 p-3 rounded-[4px] flex items-center">
            <Image alt="bell" src="/icons/bell.svg" width={24} height={24} />
            {/* no. of notifs */}
            {/* <p className="absolute top-[6px] right-[6px] bg-red-600 text-white rounded-[4px] text-[12px] px-[5px]">
              3
            </p> */}
          </button>
          {/* Toggle */}
          <button
            onClick={() => setShow(!show)}
            className="bg-zinc-800 p-3 rounded-[4px] gap-2 flex items-center md:hidden"
          >
            <Image
              alt="user"
              src={
                show ? '/icons/nav/close-circle.svg' : '/icons/nav/burger.svg'
              }
              width={24}
              height={24}
            />
            <p className="text-white text-[16px] font-normal">
              {show ? 'Close' : 'Tools'}
            </p>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-zinc-800 p-3 rounded-[4px] flex items-center max-md:hidden">
                <Image
                  alt="user"
                  src="/icons/user.png"
                  width={24}
                  height={24}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <div className="flex flex-col space-y-1 leading-none">
                  {session?.data?.user?.username && (
                    <p className="font-medium truncate text-sm text-zinc-400 cursor-pointer">
                      {session?.data?.user?.username}
                    </p>
                  )}
                  {session?.data?.user?.email && (
                    <p className="w-[200px] truncate text-sm text-zinc-400 cursor-pointer">
                      {session?.data?.user?.email}
                    </p>
                  )}
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href="/user/profile">
                <DropdownMenuItem>
                  <PersonIcon className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/user/history">
                <DropdownMenuItem>
                  <ArchiveIcon className="w-4 h-4 mr-2" />
                  History
                </DropdownMenuItem>
              </Link>
              <Link href="/user/payments">
                <DropdownMenuItem>
                  <ReaderIcon className="w-4 h-4 mr-2" />
                  Payments
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event: { preventDefault: () => void }) => {
                  event.preventDefault();
                  signOut().catch(console.error);
                }}
                className="font-semibold cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default NavHeader;
