'use client';

import React, { useMemo, useState } from 'react';
import Attributes from '@/components/analytics/overview/attributes';
import FindingsGraph from '@/components/audit/detail/findings-graph';
import SecurityOverview from '@/components/analytics/overview/security';
import GovernanceInfo from '@/components/audit/detail/overview/governance';
import CommunityInfo from '@/components/audit/detail/overview/community';
import SecurityInfo from '@/components/audit/detail/overview/security';
import MarketInfo from '@/components/audit/detail/overview/market';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import useTokenInfo from '@/hooks/useTokenInfo';

interface AuditOverviewProps {
  address: string;
  token: any;
  premium?: boolean;
}

const AuditOverview: React.FC<AuditOverviewProps> = ({
  address,
  token,
  premium,
}) => {
  //   const [isLoading, setLoading] = useState(true);
  const {
    isFetching: isFetchingscan,
    tokenInfo: tokenInfoscan,
    error: errorscan,
  } = useTokenInfo(address, 'scan', true);
  console.log('tokenInfoscan', tokenInfoscan);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-4 md:col-span-1">
        <div className="">
          <div className="flex">
            <Attributes tokenAddress={address} />
          </div>

          {!premium && (
            <div className="flex bg-gradient-to-r from-[#001735] to-[#000] mt-3">
              <div
                className="flex flex-col gap-5 px-4 py-4 bg-[url(/backgrounds/audit-detail.png)] bg-no-repeat"
                style={{
                  backgroundSize: '70%',
                  backgroundPosition: 'bottom right',
                }}
              >
                <p className="text-zinc-200 text-sm w-[52%]">
                  Unlock comprehensive insights on the{' '}
                  {token ? token.symbol : '...'} token for informed investment
                  decisions.
                </p>

                <Link
                  href={`/audit/token/${address}/detailed`}
                  className={`bg-[#0E76FD] border-[#0E76FD] flex items-center justify-center text-zinc-50 text-md border font-semibold px-2 h-[40px] w-fit text-center transition-all ease-in duration-200`}
                >
                  Detailed Audit
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="col-span-4 md:col-span-3 grid grid-rows gap-4">
        <div className="row-span-1 grid grid-cols-3 gap-4">
          <div className="col-span-3 md:col-span-2 h-full">
            <SecurityOverview
              address={address}
              showRadar={true}
              showDetails={false}
            />
          </div>
          <div className="h-full max-md:w-screen">
            <FindingsGraph address={address} />
          </div>
        </div>
        <div className="row-span-1 ">
          {!isFetchingscan ? (
            <SecurityInfo
              contractAddress={address}
              securityScore={tokenInfoscan ? tokenInfoscan.securityScore : 0}
            />
          ) : (
            <Skeleton className="h-14 w-full" />
          )}
        </div>
        <div className="row-span-1">
          {!isFetchingscan ? (
            <GovernanceInfo
              contractAddress={address}
              governanceScore={
                tokenInfoscan ? tokenInfoscan.decentralisationScore : 0
              }
            />
          ) : (
            <Skeleton className="h-14 w-full" />
          )}
        </div>
        <div className="row-span-1">
          {!isFetchingscan ? (
            <CommunityInfo
              contractAddress={address}
              communityScore={tokenInfoscan ? tokenInfoscan.communityScore : 0}
            />
          ) : (
            <Skeleton className="h-14 w-full" />
          )}
        </div>
        <div className="row-span-1 mb-20">
          {!isFetchingscan ? (
            <MarketInfo
              contractAddress={address}
              marketScore={tokenInfoscan ? tokenInfoscan.marketScore : 0}
            />
          ) : (
            <Skeleton className="h-14 w-full" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditOverview;
