'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import useTokenInfo from '@/hooks/useTokenInfo';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@radix-ui/react-select';
import { BiChevronDown } from 'react-icons/bi';

import TokenAuditHead from '@/components/monitoring/header';
import TradingViewChart from '@/components/monitoring/trading-view-graph';
import { TopHolding } from '@/components/monitoring/token-analytics/wallets-overview/top-holding';
import { OrderBook } from '@/components/monitoring/token-analytics/wallets-overview/order-book';
import TokenDetailTable from '@/components/monitoring/transaction-ledger/token-table';
import TokenDetailOverView from '@/components/monitoring/token-overview/token-detailed-overview';
import TransferVolumeGraph from '@/components/monitoring/token-analytics/transaction-volume-overview/transfer-volume-graph';
import HoldersGraph from '@/components/monitoring/token-analytics/transaction-volume-overview/holders-graph';

type Props = {
  params: {
    address: string;
  };
};

const timeFilter = [
  { time: '6M', value: '6M' },
  { time: '1M', value: '1M' },
  { time: '1W', value: '1W' },
  { time: '1D', value: '1D' },
];

const graphType = [
  { type: 'Top Holding Wallet', value: 'Top Holding Wallet' },
  { type: 'Order Book', value: 'Order Book' },
];

const Analytics = ({ params }: Props) => {
  const { toast } = useToast();
  const contractAddress = params.address;
  const [liveData, setLiveData] = useState<any>(null);
  const { isFetching, tokenMetaData, error } = useTokenInfo(
    contractAddress,
    true
  );

  const [volumeType, setVolumeType] = useState('Transfer volume');
  const [choosenTime, setChoosenTime] = useState('1D');
  const [choosenType, setChoosenType] = useState('Top Holding Wallet');
  const [time, setTime] = useState('1D'); // Use time in api
  const [walletGraph, setWalletGraph] = useState('Top Holding Wallet'); // Use time in api

  const timeMap = new Map(timeFilter.map(item => [item.time, item]));
  const graphMap = new Map(graphType.map(item => [item.type, item]));

  const handleDropdownChange = (value: string) => {
    const timeItem = timeMap.get(value);
    if (timeItem) {
      setTime(timeItem.value);
      setChoosenTime(timeItem.time);
    }
  };

  const handleTypeChange = (value: string) => {
    const walletItem = graphMap.get(value);
    if (walletItem) {
      setWalletGraph(walletItem.value);
      setChoosenType(walletItem.type);
    }
  };

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

          <div className="grid grid-cols-4 gap-6 pb-3">
            <div className="flex flex-col col-span-1 gap-4">
              {/* Token Detailed Info */}
              <TokenDetailOverView />
            </div>

            <div className="col-span-3">
              {/* candle stick graph */}

              <TradingViewChart
                pair={'OSMO/USD'}
                chain={'V3 Uniswap (Ethereum)'}
              />

              {/* Middle Section Graph */}
              <div className="grid grid-cols-3 gap-4">
                {/* Transfer Volume, Holders Graph */}
                <div className="flex flex-col col-span-1 gap-6 p-2 my-3 border border-zinc-900">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h1
                        className={`text-[16px] ${
                          volumeType === 'Transfer volume'
                            ? 'text-neutral-100'
                            : 'text-neutral-600'
                        } transition-all ease-in duration-100 cursor-pointer`}
                        onClick={() => setVolumeType('Transfer volume')}
                      >
                        Transfer volume
                      </h1>
                      <h1
                        className={`text-[16px] ${
                          volumeType === 'Holders'
                            ? 'text-neutral-100'
                            : 'text-neutral-600'
                        } transition-all ease-in duration-100 cursor-pointer`}
                        onClick={() => setVolumeType('Holders')}
                      >
                        Holders
                      </h1>
                    </div>
                    <div className="relative z-20">
                      <Select onValueChange={handleDropdownChange}>
                        <SelectTrigger className="w-[60px] bg-zinc-900 rounded-[4px] outline-none p-2 py-1 text-white">
                          <div className="flex items-center justify-between text-sm">
                            {choosenTime}
                            <BiChevronDown className="text-neutral-400 text-[28px]" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="w-[60px] bg-zinc-900 text-white pointer rounded-[4px] overflow-auto">
                          <SelectGroup>
                            {timeFilter.map((item, i) => (
                              <SelectItem
                                key={i}
                                className="p-2 pl-3 outline-none cursor-pointer hover:bg-zinc-800"
                                value={item.time}
                              >
                                {item.time}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Graph Section */}
                  {volumeType === 'Transfer volume' ? (
                    <TransferVolumeGraph />
                  ) : (
                    <HoldersGraph />
                  )}
                </div>
                <div className="col-span-2 border border-zinc-900 p-2 flex flex-col gap-6 my-3 bg-[#0C0C0C]">
                  {/* Top Holding Wallets / Order Book */}
                  {/* Graph Section */}
                  {choosenType === 'Top Holding Wallet' ? (
                    <TopHolding
                      choosenType={choosenType}
                      handleTypeChange={handleTypeChange}
                    />
                  ) : (
                    <OrderBook
                      choosenType={choosenType}
                      handleTypeChange={handleTypeChange}
                    />
                  )}
                </div>
              </div>
              {/* Token detail in Table format */}
              <TokenDetailTable />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 pb-3">
            <div className="flex flex-col col-span-1 gap-4">
              {/* Token Detailed Info */}
              <TokenDetailOverView />
            </div>

            <div className="col-span-3">
              {/* candle stick graph */}

              <TradingViewChart
                pair={'OSMO/USD'}
                chain={'V3 Uniswap (Ethereum)'}
              />

              {/* Middle Section Graph */}
              <div className="grid grid-cols-3 gap-4">
                {/* Transfer Volume, Holders Graph */}
                <div className="flex flex-col col-span-1 gap-6 p-2 my-3 border border-zinc-900">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h1
                        className={`text-[16px] ${
                          volumeType === 'Transfer volume'
                            ? 'text-neutral-100'
                            : 'text-neutral-600'
                        } transition-all ease-in duration-100 cursor-pointer`}
                        onClick={() => setVolumeType('Transfer volume')}
                      >
                        Transfer volume
                      </h1>
                      <h1
                        className={`text-[16px] ${
                          volumeType === 'Holders'
                            ? 'text-neutral-100'
                            : 'text-neutral-600'
                        } transition-all ease-in duration-100 cursor-pointer`}
                        onClick={() => setVolumeType('Holders')}
                      >
                        Holders
                      </h1>
                    </div>
                    <div className="relative z-20">
                      <Select onValueChange={handleDropdownChange}>
                        <SelectTrigger className="w-[60px] bg-zinc-900 rounded-[4px] outline-none p-2 py-1 text-white">
                          <div className="flex items-center justify-between text-sm">
                            {choosenTime}
                            <BiChevronDown className="text-neutral-400 text-[28px]" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="w-[60px] bg-zinc-900 text-white pointer rounded-[4px] overflow-auto">
                          <SelectGroup>
                            {timeFilter.map((item, i) => (
                              <SelectItem
                                key={i}
                                className="p-2 pl-3 outline-none cursor-pointer hover:bg-zinc-800"
                                value={item.time}
                              >
                                {item.time}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Graph Section */}
                  {volumeType === 'Transfer volume' ? (
                    <TransferVolumeGraph />
                  ) : (
                    <HoldersGraph />
                  )}
                </div>
                <div className="col-span-2 border border-zinc-900 p-2 flex flex-col gap-6 my-3 bg-[#0C0C0C]">
                  {/* Top Holding Wallets / Order Book */}
                  {/* Graph Section */}
                  {choosenType === 'Top Holding Wallet' ? (
                    <TopHolding
                      choosenType={choosenType}
                      handleTypeChange={handleTypeChange}
                    />
                  ) : (
                    <OrderBook
                      choosenType={choosenType}
                      handleTypeChange={handleTypeChange}
                    />
                  )}
                </div>
              </div>
              {/* Token detail in Table format */}
              <TokenDetailTable />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
