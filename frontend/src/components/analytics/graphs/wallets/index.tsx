import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import { Skeleton } from '@/components/ui/skeleton';
import WalletBubble from './bubble';
import WalletTable from './table';

type Props = {};

const WalletsGraph: React.FC<{
  address: string;
  symbol: string;
  limit?: number;
}> = ({ address, symbol, limit }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);

    const loadData = async () => {
      const queryString = qs.stringify({
        type: 'holders',
        address,
        symbol,
        limit,
      });
      const response = await axios.get(`/api/analytics?${queryString}`);
      //   console.log('response', response);
      setData(response.data);
      setLoading(false);
    };

    loadData();
  }, [address]);

  if (isLoading) {
    return (
      <Skeleton className="w-[100%] h-[320px] aspect-landscape translate-y-12" />
    );
  }

  return (
    <div className="flex flex-col max-md:gap-6 md:flex-row md:overflow-hidden">
      <div className="flex flex-col w-full max-md:mb-6 md:w-[50%]">
        <WalletBubble data={data} />
      </div>
      <div className="flex flex-col w-full md:w-[50%]">
        <WalletTable data={data} />
      </div>
    </div>
  );
};

export default WalletsGraph;
