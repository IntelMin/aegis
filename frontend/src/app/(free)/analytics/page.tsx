'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TokenTitle from '@/components/monitoring/token-title';
import TokenInfo from '@/components/monitoring/token-info';
import TokenHeader from '@/components/monitoring/header';

const LiveMonitoring = () => {
  //   const [collections, setCollections] = useState<CollectionProps[]>([]);
  const [chainId, setChainId] = useState('1');
  const [time, setTime] = useState('1D');
  const [tableLimit, setTableLimit] = useState(20);

  useEffect(() => {
    axios.get(`api/dashboard/live`).then(response => {});
  }, []);

  return (
    <div className="flex flex-col px-10 mt-12 gap-9">
      <TokenHeader />
      {/* Token Stats / Graph / Table */}
      <TokenInfo />
    </div>
  );
};

export default LiveMonitoring;
