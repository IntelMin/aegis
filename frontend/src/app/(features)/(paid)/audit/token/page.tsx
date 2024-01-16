'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import useTokenInfo from '@/hooks/useTokenInfo';
import ScaleLoader from 'react-spinners/ScaleLoader';

type Props = {};

const TokenAuditorForm = (props: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedAddress, setSubmittedAddress] = useState<string>('');

  const { isFetching, tokenRequestInfo, error } = useTokenInfo(
    submitting ? submittedAddress : '',
    'meta',
    false
  );

  useEffect(() => {
    if (!submitting) return;

    if (!isFetching && tokenRequestInfo && !error) {
      setSubmitting(false);

      router.push(`/audit/token/${submittedAddress}`);
    }

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error fetching token information',
      });
      setSubmitting(false);
    }
  }, [
    submitting,
    isFetching,
    tokenRequestInfo,
    error,
    submittedAddress,
    router,
    toast,
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tokenAddress) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a valid contract address',
      });
      return;
    }
    console.log(tokenAddress);
    setSubmittedAddress(tokenAddress);
    setSubmitting(true);
  };

  return (
    <div
      className={`bg-[url(/backgrounds/audit-token.png)] h-[calc(100vh-80px)] bg-cover pt-[80px] w-full flex flex-col items-center justify-center max-md:px-4`}
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
            className="text-[14px] text-white placeholder:text-neutral-600 border-none outline-none bg-zinc-900 border border-zinc-800 py-2 pl-2 pr-4 gap-2 w-[340px] md:w-[400px]"
          />
          <button
            disabled={submitting}
            type="submit"
            className={`${
              tokenAddress === ''
                ? 'bg-[#121F31] text-zinc-400'
                : 'bg-[#0E76FD] text-white'
            } text-[14px] font-[300] px-12 py-[6px] w-[340px] md:w-[400px] transition-all ease-in duration-150`}
          >
            {submitting ? (
              <ScaleLoader width={4} height={10} color="white" />
            ) : (
              'Submit'
            )}
          </button>
          <p className="text-neutral-500 text-[12px] text-center max-md:w-[90%]">
            Submit token contract address to to get a detailed analysis of the
            token, before making your trade decision.
          </p>
        </form>
      </div>
      {/* Premium Unlock option */}
      <div className="flex items-center max-md:flex-col max-md:gap-3 justify-between md:w-[600px] premium-unlock-con p-4">
        <div className="flex flex-col gap-3 w-full md:w-[70%]">
          <h1 className="font-normal text-sm md:text-[16px] text-neutral-50">
            UNLOCK FULL AUDIT REPORT WITH PREMIUM.
          </h1>
          <p className="text-[12px] md:text-[14px] font-normal text-neutral-400 max-md:text-center">
            A comprehensive audit report that includes a detailed analysis of
            the code, a list of all the vulnerabilities found, and
            recommendations on how to fix them.
          </p>
        </div>
        <div
          onClick={() => {
            if (tokenAddress.trim() !== '')
              router.push(`/payment/${tokenAddress}/pay`);
          }}
          className="flex items-center gap-2 py-2 justify-center text-zinc-50 bg-[#0E76FD] max-md:mt-2 max-md:w-full md:w-[120px]"
        >
          Unlock{' '}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M12.6667 7.33325H3.33333C2.59695 7.33325 2 7.93021 2 8.66659V13.3333C2 14.0696 2.59695 14.6666 3.33333 14.6666H12.6667C13.403 14.6666 14 14.0696 14 13.3333V8.66659C14 7.93021 13.403 7.33325 12.6667 7.33325Z"
              stroke="#FAFAFA"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.66675 7.33319V4.66652C4.66592 3.83989 4.97227 3.04244 5.52633 2.42897C6.08039 1.8155 6.84264 1.42979 7.66509 1.34672C8.48754 1.26364 9.31151 1.48913 9.97707 1.9794C10.6426 2.46967 11.1023 3.18976 11.2667 3.99986"
              stroke="#FAFAFA"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TokenAuditorForm;
