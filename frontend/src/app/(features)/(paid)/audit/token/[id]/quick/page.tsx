'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AreaChart from '@/components/audit/detail/area-chart';
import TokenAuditHead from '@/components/analytics/header';
import SecurityScore from '@/components/audit/detail/security-score';
import AuditHistory from '@/components/audit/detail/audit-history';
import Link from 'next/link';
import axios from 'axios';
import useTokenInfo from '@/hooks/useTokenInfo';
import { showToast } from '@/components/toast';

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
    <div className="flex flex-col w-full gap-6 px-3 md:px-5 py-5">
      {/* Token Audit Head */}
      <TokenAuditHead
        showTitle={true}
        liveData={liveData}
        metadata={tokenInfo}
      />
      <div className="grid grid-cols-11 gap-5">
        <div className="flex flex-col col-span-11 md:col-span-6 gap-5">
          {/* Security Score */}
          {/* <SecurityScore demoSecurityScore={demoSecurityScore} /> */}
          {/* Area Graph Representation */}
          <div className="w-full p-6 border border-zinc-900">
            <AreaChart />
          </div>
        </div>
        <div className="flex flex-col col-span-11 max-md:bg-[#0C0C0C] md:col-span-5 gap-5">
          {/* Audit History */}
          <AuditHistory />
          {/* Detail Audit Card */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#001735] to-[#000] max-md:hidden">
            <div className="flex flex-col gap-5 px-6 py-4 w-[58%]">
              <Link
                href={`/audit/token/${params?.id}/detailed`}
                className={`bg-[#0E76FD] border-[#0E76FD] flex items-center justify-center text-zinc-50 text-[18px] border font-[400] px-2 h-[40px] w-fit text-center transition-all ease-in duration-200`}
              >
                Detailed Audit
              </Link>
              <p className="text-neutral-200 text-[14px] font-[300]">
                Premium information on $AAVE token, to guide you on making the
                best trading decisions
              </p>
            </div>
            <div className="w-1/2 h-full">
              <Image
                src="/backgrounds/audit-detail.png"
                alt="detail-card-bg"
                width={200}
                height={160}
                className="h-[160px] w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAuditPage;
