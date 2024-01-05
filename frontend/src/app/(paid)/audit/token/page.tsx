'use client';

import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import ScaleLoader from 'react-spinners/ScaleLoader';

type Props = {};

const TokenAuditorForm = (props: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [tokenAddress, setTokenAddress] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    console.log(tokenAddress);

    axios.get(`/api/token/info?address=${tokenAddress}&type=request`).then(
      response => {
        setIsLoading(false);
        router.push(`/audit/token/${tokenAddress}`);
      },
      error => {
        setIsLoading(false);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an error fetching token information',
        });
      }
    );

    // check if valid ethereum address
    setTokenAddress('');
  };

  return (
    <div
      className={`bg-[url(/backgrounds/audit-token.png)] h-screen bg-cover pt-[80px] w-full flex items-center justify-center`}
    >
      <div className="flex flex-col items-center justify-center gap-12 w-[400px] -translate-y-12">
        <h1 className="text-neutral-200 text-[24px] font-[600]">
          Token Auditor
        </h1>
        <form
          className="flex flex-col items-center justify-center gap-6"
          onSubmit={handleSubmit}
        >
          <input
            placeholder="Enter contract address"
            type="text"
            value={tokenAddress}
            onChange={e => setTokenAddress(e.target.value)}
            className="text-[14px] text-white placeholder:text-neutral-600 border-none outline-none bg-zinc-900 border border-zinc-800 py-2 pl-2 pr-4 gap-2 w-[400px]"
          />
          <button
            disabled={isLoading}
            type="submit"
            className={`${
              tokenAddress === ''
                ? 'bg-[#121F31] text-zinc-400'
                : 'bg-[#0E76FD] text-white'
            } text-[14px] font-[300] px-12 py-[6px] w-[400px] transition-all ease-in duration-150`}
          >
            {isLoading ? (
              <ScaleLoader width={4} height={10} color="white" />
            ) : (
              'Submit'
            )}
          </button>
          <p className="text-neutral-500 text-[12px] text-center">
            Submit token contract address to to get a detailed analysis of the
            token, before making your trade decision.
          </p>
        </form>
      </div>
    </div>
  );
};

export default TokenAuditorForm;
