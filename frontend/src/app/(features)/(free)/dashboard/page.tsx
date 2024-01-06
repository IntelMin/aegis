'use client';

import React, { useEffect, useState } from 'react';
import DashboardDataTable from '@/components/dashboard/dashboard-table';
import DropdownFilter from '@/components/dashboard/dashboard-filter';
import TokenMarquee from '@/components/dashboard/token-marquee';
import axios from 'axios';

const Dashboard = () => {
  //   const [collections, setCollections] = useState<CollectionProps[]>([]);
  const [time, setTime] = useState('1D');
  const [tableData, setTableData] = useState([]);
  const [marqueeData, setMarqueeData] = useState([]);
  const [tableLimit, setTableLimit] = useState(20);

  useEffect(() => {
    axios.get(`api/dashboard/?resolution="${time}"`).then(response => {
      setTableData(response.data);
    });
  }, [time, tableLimit]);

  useEffect(() => {
    axios.get(`api/dashboard/live`).then(response => {
      setMarqueeData(response?.data);
    });
  }, []);

  return (
    <div className="px-10 py-10">
      <div className="grid grid-cols-1 gap-6 relative z-[-1]">
        <TokenMarquee marqueeData={marqueeData} />
      </div>
      <DropdownFilter time={time} setTime={setTime} />
      <DashboardDataTable
        tableLimit={tableLimit}
        setTableLimit={setTableLimit}
        tableData={tableData}
      />
    </div>
  );
};

export default Dashboard;
