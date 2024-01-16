'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import useTokenInfo from '@/hooks/useTokenInfo';

import TokenHeader from '@/components/analytics/header';

type Props = {
  params: {
    address: string;
  };
};

const Analytics = ({ params }: Props) => {
  const { toast } = useToast();
  const contractAddress = params.address;
  const [liveData, setLiveData] = useState<any>(null);
  const [tokenDetails, setTokenDetails] = useState<any>(null);
  const { isFetching, tokenMetaData, error } = useTokenInfo(
    contractAddress,
    true
  );

  return (
    <div className="flex flex-col px-4 md:px-10 mt-4 gap-9">
      <TokenHeader
        showTitle={true}
        liveData={liveData}
        metadata={tokenMetaData}
      />

      <div className="grid grid-cols-4 gap-6 pb-3">
        <div>{/* Token Detailed Info */}</div>
        <div className="col-span-4 md:col-span-3"></div>
      </div>
    </div>
  );
};

export default Analytics;
