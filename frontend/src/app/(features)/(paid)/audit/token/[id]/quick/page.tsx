'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import useTokenInfo from '@/hooks/useTokenInfo';
import { showToast } from '@/components/toast';
import TokenHeader from '@/components/analytics/header';
import AuditHistory from '@/components/audit/detail/audit-history';
import Attributes from '@/components/analytics/overview/attributes';
import SecurityOverview from '@/components/analytics/overview/security';
import GovernanceInfo from '@/components/audit/detail/overview/governance';
import CommunityInfo from '@/components/audit/detail/overview/community';
import SecurityInfo from '@/components/audit/detail/overview/security';
import MarketInfo from '@/components/audit/detail/overview/market';

type Props = {
  params: {
    id: string;
  };
};

const QuickAuditPage = ({ params }: Props) => {
  const contractAddress = params.id;
  const [liveData, setLiveData] = useState<any>(null);
  const { isFetching, tokenInfo, error } = useTokenInfo(
    contractAddress,
    'meta',
    true
  );

  const fetchData = () => {
    axios
      .get(`/api/token/live/?address=${contractAddress}`)
      .then(response => {
        setLiveData(response?.data);
      })
      .catch(error => {
        console.error('Error fetching live data:', error);
      });
  };

  useEffect(() => {
    if (error) {
      showToast({
        type: 'error',
        message: 'Error',
        description: 'There was an error fetching token information',
      });
    }
  }, [isFetching, tokenInfo, error]);

  useEffect(() => {
    if (!isFetching && tokenInfo && !error) {
      fetchData();
    }

    const interval = setInterval(fetchData, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex flex-col px-4 md:px-10 mt-8 gap-6">
        <TokenHeader
          showTitle={true}
          liveData={liveData}
          metadata={tokenInfo}
        />

        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <div className="">
              <div className="flex">
                <Attributes tokenAddress={contractAddress} />
              </div>

              <div className="flex bg-gradient-to-r from-[#001735] to-[#000] mt-3">
                <div
                  className="flex flex-col gap-5 px-4 py-4 bg-[url(/backgrounds/audit-detail.png)] bg-no-repeat"
                  style={{
                    backgroundSize: '70%',
                    backgroundPosition: 'bottom right',
                  }}
                >
                  {tokenInfo && (
                    <p className="text-zinc-200 text-sm w-[52%]">
                      Unlock comprehensive insights on the {tokenInfo.symbol}{' '}
                      token for informed investment decisions.
                    </p>
                  )}

                  <Link
                    href={`/audit/token/${params?.id}/detailed`}
                    className={`bg-[#0E76FD] border-[#0E76FD] flex items-center justify-center text-zinc-50 text-md border font-semibold px-2 h-[40px] w-fit text-center transition-all ease-in duration-200`}
                  >
                    Detailed Audit
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3 grid grid-rows gap-4">
            <div className="row-span-1 grid grid-cols-3 gap-4">
              <div className="col-span-2 h-full">
                <SecurityOverview
                  address={contractAddress}
                  showRadar={true}
                  showDetails={false}
                />
              </div>
              <div className="h-full">
                <AuditHistory />
              </div>
            </div>
            <div className="row-span-1 ">
              <SecurityInfo contractAddress={contractAddress} />
            </div>
            <div className="row-span-1">
              <GovernanceInfo contractAddress={contractAddress} />
            </div>
            <div className="row-span-1">
              <CommunityInfo contractAddress={contractAddress} />
            </div>
            <div className="row-span-1 mb-20">
              <MarketInfo contractAddress={contractAddress} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickAuditPage;
