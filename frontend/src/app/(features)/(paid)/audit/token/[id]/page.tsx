'use client';

import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import useTokenInfo from '@/hooks/useTokenInfo';

type props = {
  params: {
    id: string;
  };
};

const SkeletonLoader = () => (
  <>
    <div className="flex items-center gap-4">
      <Skeleton className="h-[20px] w-[300px]" />
      <Skeleton className="h-[20px] w-[30px]" />
    </div>
    <div className="flex flex-col items-center gap-12">
      <div className="flex items-center gap-4">
        <Skeleton className="h-[40px] w-[40px] rounded-full" />
        <Skeleton className="h-[32px] w-[200px] rounded-full" />
        <Skeleton className="h-[32px] w-[50px] rounded-full" />
      </div>
      <div className="flex items-center gap-10">
        {/* Detailed */}
        <Skeleton className="h-[300px] w-[340px]" />
        <Skeleton className="h-[300px] w-[340px]" />
      </div>
    </div>
  </>
);

const TokenAuditOption = ({ params }: props) => {
  const { toast } = useToast();
  const [metadata, setMetadata] = React.useState<any>();
  const { isFetching, tokenMetaData, error } = useTokenInfo(params.id, true);

  useEffect(() => {
    if (!isFetching && tokenMetaData && !error) {
      setMetadata(tokenMetaData);
    }

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error fetching token information',
      });
    }
  }, [isFetching, tokenMetaData, error]);

  if (error) {
    return <div>Error loading token information</div>;
  }

  return (
    <div
      className={`bg-[url(/backgrounds/audit-token-option.png)] h-screen bg-cover pt-[30px] w-full flex flex-col gap-[72px] items-center justify-center`}
    >
      {isFetching ? (
        <SkeletonLoader />
      ) : (
        <>
          <div className="flex items-center gap-4">
            <h1 className="text-blue-400 text-[16px font-[300] px-4 py-2">
              {params?.id}
            </h1>
            <Link
              href="/audit/token"
              className="text-zinc-50 text-[16px] bg-zinc-900 font-[500] py-2 w-[120px] text-center"
            >
              Cancel
            </Link>
          </div>
          <div className="flex flex-col items-center gap-12">
            <div className="flex items-center gap-4">
              <Image
                src={
                  metadata?.imageSmallUrl
                    ? `/api/token/image?q=${metadata?.imageSmallUrl
                        .split('/')
                        .pop()}`
                    : `/icons/token-default.svg`
                }
                alt="token-icon"
                width={40}
                height={40}
              />
              <h1 className="text-neutral-50 text-[32px] font-[600]">
                {metadata?.name}
              </h1>
              <p className="text-neutral-300 text-[24px] font-[400]">
                {metadata?.symbol}
              </p>
            </div>
            <div className="flex items-center gap-10">
              {/* Detailed */}
              <div
                className={`from-[#19191B] to-[#000] cursor-pointer group pt-12 bg-gradient-to-b w-[340px] flex items-center justify-between flex-col gap-3 px-4 transition-all ease-in duration-200 border border-zinc-800 min-h-[380px]`}
              >
                <div className="flex flex-col items-center justify-center w-full gap-3">
                  <Link
                    href={`/audit/token/${params?.id}/detailed`}
                    className={`border-zinc-700 bg-zinc-900 text-zinc-50 text-[18px] border font-[400] px-2 h-[40px] w-fit flex items-center justify-center text-center transition-all ease-in duration-200`}
                  >
                    Detailed Audit
                  </Link>
                </div>
                <Image
                  alt="detailed-audit"
                  src={`/backgrounds/audit-detail.png`}
                  width={300}
                  height={250}
                  className={`grayscale-0 transition-all ease-in duration-200`}
                />
              </div>

              {/* Quick */}
              <div
                className={`from-[#001735] to-[#000] cursor-pointer group pt-12 bg-gradient-to-b w-[340px] flex items-center justify-between flex-col gap-3 px-4 transition-all ease-in duration-200 border border-zinc-800 min-h-[380px]`}
              >
                <div className="flex flex-col items-center justify-center w-full gap-3">
                  <Link
                    href={`/audit/token/${params?.id}/quick`}
                    className={`bg-[#0E76FD] border-[#0E76FD] text-zinc-50 text-[18px] border font-[400] px-2 h-[40px] w-fit flex items-center justify-center text-center transition-all ease-in duration-200`}
                  >
                    Quick Audit
                  </Link>
                </div>
                <Image
                  alt="detailed-audit"
                  src={`/backgrounds/audit-quick.png`}
                  width={300}
                  height={250}
                  className={`grayscale transition-all ease-in duration-200`}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TokenAuditOption;
