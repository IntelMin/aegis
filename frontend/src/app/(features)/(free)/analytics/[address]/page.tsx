'use client';
import React, { useState } from 'react';
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
import TableSwitcher from '@/components/analytics/transactions/switcher-table';
import TableTrades from '@/components/analytics/transactions/trades';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [showSection, setShowSection] = useState('info');
  const [isTVChartReady, setIsTVChartReady] = useState(false);

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
    <>
      <div className="grid grid-cols-3 md:hidden pt-5 border-b border-zinc-800">
        {sectionsArr?.map(item => (
          <button
            key={item.val}
            type="button"
            onClick={() => setShowSection(item.val)}
            className={`bg-transparent text-[16px] font-[600] pb-3 px-2 col-span-1 ${
              showSection === item.val
                ? 'text-neutral-50 border-[#2563EB]'
                : 'text-neutral-500 border-transparent'
            } border-b-2 transition-all ease-in duration-200`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="flex flex-col px-4 md:px-10 mt-8 gap-6">
        <TokenHeader
          showTitle={true}
          liveData={liveData}
          metadata={tokenInfo}
          showQuickAudit={true}
          showAddressPair={false}
        />

        <div className="grid grid-cols-4 gap-4">
          <div
            className={`${
              showSection === 'info' ? 'flex' : 'max-md:hidden'
            } md:flex flex-col col-span-4 md:col-span-1 gap-4`}
          >
            <div className="row-span-3">
              <TokenOverview
                tokenMetaData={tokenInfo}
                tokenDetails={tokenDetails}
                liveData={liveData}
              />
            </div>
          </div>
          <div className="col-span-4 md:col-span-3 flex flex-col gap-4">
            {/* Trading View chart */}
            <div
              className={`flex flex-col gap-4 ${
                showSection === 'chart' ? 'flex' : 'max-md:hidden'
              }`}
            >
              {!isTVChartReady && <Skeleton className="w-full h-[400px]" />}
              <div
                style={{
                  display: isTVChartReady ? 'block' : 'none',
                  visibility: isTVChartReady ? 'visible' : 'hidden',
                }}
              >
                <TVChart
                  symbol={`${liveData?.baseToken.symbol} / ${liveData?.quoteToken.symbol}`}
                  pairAddress={liveData?.pairAddress}
                  initialPrice="500"
                  onChartReady={() => {
                    setIsTVChartReady(true);
                  }}
                />
              </div>
            </div>

            <div
              className={`grid grid-cols-4 md:grid-cols-3 gap-4 ${
                showSection === 'volume' ? 'flex' : 'max-md:hidden'
              }`}
            >
              {/* Trades or Holders */}
              <div className="col-span-4 md:col-span-1 md:aspect-square">
                <HorizontalSwitcher
                  graphs={[
                    {
                      name: 'Volume',
                      component: GraphVolume,
                      props: { address: contractAddress },
                    },
                    {
                      name: 'Holders',
                      component: GraphHolders,
                      props: { data: 0 },
                    },
                  ]}
                  defaultResolution={'1h'}
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                {/* Holder Bubble Chart */}
                <DropdownSwitcher
                  graphs={[
                    {
                      name: 'Top Holders',
                      component: GraphWallets,
                      props: {
                        address: contractAddress,
                        symbol: (tokenInfo as any)?.symbol,
                        limit: 100,
                      },
                    },
                    {
                      name: 'Order Book',
                      component: GraphOrderBook,
                      props: {
                        pair: liveData?.pairAddress,
                        exchange: liveData?.dexId,
                        labels: liveData?.labels,
                        priceUsd: liveData?.priceUsd,
                      },
                    },
                  ]}
                  defaultResolution={'1W'}
                />
              </div>
            </div>
            {/* Transactions */}
            <div
              className={`col-span-4 md:flex-grow mb-10  max-md:overflow-x-scroll ${
                showSection === 'chart' ? 'flex' : 'max-md:hidden'
              }`}
            >
              <TableSwitcher
                tables={[
                  {
                    name: 'Trades',
                    component: TableTrades,
                    props: {
                      pair: liveData?.pairAddress,
                      symbol: liveData?.baseToken.symbol,
                      base: liveData?.quoteToken.symbol,
                    },
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
