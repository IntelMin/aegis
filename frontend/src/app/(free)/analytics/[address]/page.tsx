'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TokenTitle from '@/components/monitoring/token-title';
import TokenInfo from '@/components/monitoring/token-info';
import TokenAuditHead from '@/components/monitoring/header';
import { useToast } from '@/components/ui/use-toast';
import useTokenInfo from '@/hooks/useTokenInfo';

type Props = {
  params: {
    address: string;
  };
};

const Analytics = ({ params }: Props) => {
  const { toast } = useToast();
  const contractAddress = params.address;
  const [liveData, setLiveData] = useState<any>(null);
  const { isFetching, tokenMetaData, error } = useTokenInfo(
    contractAddress,
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
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error fetching token information',
      });
    }
  }, [isFetching, tokenMetaData, error]);

  useEffect(() => {
    if (!isFetching && tokenMetaData && !error) {
      fetchData();
    }

    const interval = setInterval(fetchData, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col px-10 mt-12 gap-9">
      {!isFetching && (
        <>
          <TokenAuditHead
            showTitle={true}
            showPremium={false}
            liveData={liveData}
            metadata={tokenMetaData}
          />
          <TokenInfo />
        </>
      )}
    </div>
  );
};

export default Analytics;
