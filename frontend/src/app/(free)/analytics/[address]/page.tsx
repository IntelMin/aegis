'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TokenTitle from '@/components/monitoring/token-title';
import TokenInfo from '@/components/monitoring/token-info';
import TokenHeader from '@/components/monitoring/header';

const LiveMonitoring = () => {
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
