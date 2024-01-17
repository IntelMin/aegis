'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import useTokenInfo from '@/hooks/useTokenInfo';
import useLiveData from '@/hooks/useLiveData';

import TokenHeader from '@/components/analytics/header';
import TokenOverview from '@/components/analytics/token-overview';

import TVChart from '@/components/analytics/tv-chart';

type Props = {
  params: {
    address: string;
  };
};

const Analytics = ({ params }: Props) => {
  const { toast } = useToast();
  const contractAddress = params.address;
  const [tokenDetails, setTokenDetails] = useState<any>(null);
  const { isFetching, tokenInfo, error } = useTokenInfo(
    contractAddress,
    'meta',
    true
  );

  const liveData = useLiveData(contractAddress);

  const [isChartReady, setIsChartReady] = useState(false);

  return (
    <div className="flex flex-col px-4 md:px-10 mt-4 gap-6">
      <TokenHeader showTitle={true} liveData={liveData} metadata={tokenInfo} />

      <div className="grid grid-cols-4 gap-6 pb-3">
        <div>
          {/* Token Detailed Info */}
          <TokenOverview
            tokenMetaData={tokenInfo}
            tokenDetails={tokenDetails}
            liveData={liveData}
          />
        </div>
        <div className="col-span-4 md:col-span-3">
          <div>
            <TVChart
              openOrders={[]}
              initialPrice={'500'}
              onChartReady={() => {
                setIsChartReady(true);
              }}
              showOrderLines={false}
              onToggleShowOrderLines={() => {}} // TODO
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
