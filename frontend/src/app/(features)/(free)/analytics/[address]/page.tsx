'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import useTokenInfo from '@/hooks/useTokenInfo';
import useLiveData from '@/hooks/useLiveData';

import TokenHeader from '@/components/analytics/header';
import TokenOverview from '@/components/analytics/overview';

import TVChart from '@/components/analytics/tv';
import GraphVolume from '@/components/analytics/graphs/volume';
import GraphHolders from '@/components/analytics/graphs/holders';
import GraphOrderBook from '@/components/analytics/graphs/order-book';
import GraphWallets from '@/components/analytics/graphs/wallets';
import HorizontalSwitcher from '@/components/analytics/graphs/switcher-horizontal';
import DropdownSwitcher from '@/components/analytics/graphs/switcher-dropdown';
import TokenDetailTable from '@/components/analytics/transactions/token-table';

type Props = {
  params: {
    address: string;
  };
};

const Analytics = ({ params }: Props) => {
  const contractAddress = params.address;
  const [tokenDetails, setTokenDetails] = useState<any>(null);
  const { isFetching, tokenInfo, error } = useTokenInfo(
    contractAddress,
    'meta',
    true
  );

  const liveData = useLiveData(contractAddress);
  const [isChartReady, setIsChartReady] = useState(false);
  const [showSection, setShowSection] = useState('info');

  const sectionsArr = [
    {
      name: 'Token info',
      val: 'info',
    },
    {
      name: 'Chart+Txns',
      val: 'chart',
    },
    {
      name: 'Volume+Wallets',
      val: 'volume',
    },
  ];

  return (
    <div className="flex flex-col px-4 md:px-10 mt-8 gap-6">
      <TokenHeader showTitle={true} liveData={liveData} metadata={tokenInfo} />

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 flex flex-col gap-4">
          {/* Token details */}
          <div className="row-span-3">
            <TokenOverview
              tokenMetaData={tokenInfo}
              tokenDetails={tokenDetails}
              liveData={liveData}
            />
          </div>
        </div>
        <div className="col-span-3 flex flex-col gap-4">
          {/* Trading View chart */}
          {liveData?.pairAddress && (
            <TVChart
              pairAddress={liveData.pairAddress}
              initialPrice="500"
              onChartReady={() => {
                setIsChartReady(true);
              }}
            />
          )}
          <div className="grid grid-cols-3 gap-4">
            {/* Trades or Holders */}
            <div className="col-span-1 aspect-square">
              <HorizontalSwitcher
                graphs={[
                  {
                    name: 'Volume',
                    component: GraphVolume,
                    props: { data: 0 },
                  },
                  {
                    name: 'Holders',
                    component: GraphHolders,
                    props: { data: 0 },
                  },
                ]}
                defaultResolution={'1W'}
              />
            </div>
            <div className="col-span-2">
              {/* Holder Bubble Chart */}
              <DropdownSwitcher
                graphs={[
                  {
                    name: 'Volume',
                    component: GraphWallets,
                    props: { data: 0 },
                  },
                  {
                    name: 'Order Book',
                    component: GraphOrderBook,
                    props: { data: 0 },
                  },
                ]}
                defaultResolution={'1W'}
              />
            </div>
          </div>
          {/* Transactions */}
          <div className="flex-grow">
            <TokenDetailTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
