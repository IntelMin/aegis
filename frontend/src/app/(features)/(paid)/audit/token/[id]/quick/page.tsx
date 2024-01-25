'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import useTokenInfo from '@/hooks/useTokenInfo';
import { showToast } from '@/components/toast';
import TokenHeader from '@/components/analytics/header';
import AuditOverview from '@/components/audit/detail/overview';
import { metadata } from '@/app/layout';

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

        <AuditOverview address={contractAddress} token={tokenInfo} />
      </div>
    </>
  );
};

export default QuickAuditPage;
