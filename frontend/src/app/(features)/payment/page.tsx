'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAccount, useSendTransaction, useWaitForTransaction } from 'wagmi';
import { useSession } from 'next-auth/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { set } from 'zod';
import { ConnectButton } from '@rainbow-me/rainbowkit';

type PricingCardProps = {
  isYearly?: boolean;
  title: string;
  ethPrice?: number;
  credits?: number;
  description: string;
  features: string[];
  popular?: boolean;
  exclusive?: boolean;
  handleConfirm: () => void;
  handlePackageSelect: (packageName: string, amount: number) => void;
};

const PricingHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <section className="text-center flex flex-col gap-2">
    <h2 className="text-3xl font-bold">{title}</h2>
    <p className="text-lg text-zinc-300 pt-1">{subtitle}</p>
    <br />
  </section>
);

const PricingCard = ({
  title,
  ethPrice,
  credits,
  description,
  features,
  popular,
  exclusive,
  handleConfirm,
  handlePackageSelect,
}: PricingCardProps) => {
  const { address, isConnected } = useAccount();
  return (
    <Card
      className={cn(
        `w-72 flex flex-col justify-between py-1 ${
          popular ? 'border-blue-400' : 'border-zinc-700'
        } mx-auto sm:mx-0`,
        {
          'animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors':
            exclusive,
        }
      )}
    >
      <div>
        <CardHeader className="pb-8 pt-4">
          {popular ? (
            <div className="flex justify-between">
              <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
                {title}
              </CardTitle>
              <div
                className={cn(
                  'px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white',
                  {
                    'bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black ':
                      popular,
                  }
                )}
              >
                Popular
              </div>
            </div>
          ) : (
            <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
              {title}
            </CardTitle>
          )}
          <div className="flex gap-0.5">
            <h3 className="text-3xl font-bold">Ξ{ethPrice}</h3>
            <span className="flex flex-col justify-end text-sm mb-1">
              / {credits} credits
            </span>
          </div>
          <CardDescription className="pt-1.5 h-12">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {features.map((feature: string) => (
            <CheckItem key={feature} text={feature} />
          ))}
        </CardContent>
      </div>
      <CardFooter className="mt-2">
        {/* <Button className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium  dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
        <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
        test
      </Button> */}
        <Dialog>
          <DialogTrigger asChild className="w-full">
            <Button
              onClick={() => handlePackageSelect(title, Number(ethPrice))}
            >
              Purchase
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Purchase credits</DialogTitle>
              <DialogDescription>Confirm your purchase</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 border-y border-zinc-200 dark:border-zinc-800">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="invoice-number">
                  Package
                </Label>
                <div className="col-span-3" id="invoice-number">
                  {title}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="total-amount">
                  Credits
                </Label>
                <div className="col-span-3" id="total-amount">
                  {credits}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="total-amount">
                  Price
                </Label>
                <div className="col-span-3" id="total-amount">
                  Ξ{ethPrice}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              {isConnected ? (
                <Button onClick={handleConfirm} type="submit">
                  Confirm
                </Button>
              ) : (
                <Button>
                  <ConnectButton />
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={18} className="my-auto text-green-400" />
    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
  </div>
);

export default function PricingPage() {
  const session = useSession();
  const [packageName, setPackagename] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const ETH_TO_WEI = BigInt(10 ** 18);
  const { data: txn, sendTransaction: buy } = useSendTransaction({
    onSuccess: async txn => {
      console.log('success');
      const res = await fetch('/api/credit/add', {
        method: 'POST',
        body: JSON.stringify({
          email: session?.data?.user?.email,
          hash: txn?.hash,
          amount: amount,
          packageName: packageName,
        }),
      });

      console.log(res);
    },
  });

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
  const {
    isError,
    isSuccess,
    fetchStatus: waittx,
  } = useWaitForTransaction({ hash: txn?.hash });
  const handleConfirm = async () => {
    console.log('confirm');
    setLoading(true);
    buy({
      to: process.env.NEXT_PUBLIC_AEGIS_WALLET as `0x${string}`,
      value: BigInt(Math.floor(amount * Number(ETH_TO_WEI))),
    });

    setLoading(false);
  };
  const handlePackageSelect = async (packageName: string, amount: number) => {
    setPackagename(packageName);
    setAmount(amount);
  };

  const plans = [
    {
      title: 'Starter',
      ethPrice: 0.5,
      credits: 100,
      description: 'For quick audits and testing',
      features: [
        '1 Full Audit Report',
        '7 Detailed Reports (via web)',
        '8 Code Audits',
      ],
    },
    {
      title: 'Seasoned',
      ethPrice: 1,
      credits: 230,
      description: 'Perfect for small teams and advanced users',
      features: [
        '2 Full Audit Reports',
        '14 Detailed Reports (via web)',
        '16 Code Audits',
      ],
      popular: true,
    },
    {
      title: 'Veteran',
      ethPrice: 5,
      credits: 600,
      description: 'Experienced users who know what they want',
      features: [
        '5 Full Audit Reports',
        '35 Detailed Reports (via web)',
        '40 Code Audits',
        'Super Exclusive Features',
      ],
      exclusive: true,
    },
  ];
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="mb-4">
        <ConnectButton />
      </div>

      <PricingHeader
        title="Aegis Packages"
        subtitle="Choose the package that's right for you"
      />
      <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
        {plans.map(plan => {
          return (
            <PricingCard
              key={plan.title}
              {...plan}
              handleConfirm={handleConfirm}
              handlePackageSelect={handlePackageSelect}
            />
          );
        })}
      </section>
    </div>
  );
}
