'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useTokenInfo from '@/hooks/useTokenInfo';
import ScaleLoader from 'react-spinners/ScaleLoader';
import toast from 'sonner';
import { showToast } from '@/components/toast';
type Props = {};

const TokenAuditorForm = (props: Props) => {
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
      showToast({
        type: 'error',
        message: 'Error',
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
      showToast({
        type: 'error',
        message: 'Error',
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
    </div>
  );
};

export default TokenAuditorForm;
