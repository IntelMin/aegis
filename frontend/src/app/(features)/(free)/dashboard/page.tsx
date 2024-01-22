'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import GridLoader from 'react-spinners/GridLoader';

const DashboardDataTable = dynamic(
  () => import('@/components/dashboard/dashboard-table'),
  {
    loading: () => <GridLoader color="white" />,
  }
);

const DropdownFilter = dynamic(
  () => import('@/components/dashboard/dashboard-filter'),
  {
    loading: () => <GridLoader color="white" />,
  }
);

const TokenMarquee = dynamic(
  () => import('@/components/dashboard/token-marquee'),
  {
    loading: () => <GridLoader color="white" />,
  }
);

const Dashboard = () => {
  const session = useSession();
  const [time, setTime] = useState<number>();
  const [tableData, setTableData] = useState([]);
  const [marqueeData, setMarqueeData] = useState([]);
  const [tableLimit, setTableLimit] = useState(20);

  useEffect(() => {
    if (time !== undefined) {
      axios.get(`api/dashboard?resolution=${time}`).then(response => {
        setTableData(response.data);
      });
    }
  }, [time, tableLimit]);

  useEffect(() => {
    axios.get(`api/dashboard/live`).then(response => {
      setMarqueeData(response?.data);
    });
  }, []);

  return (
    <div className="px-6 md:px-10 py-10">
      <div className="grid grid-cols-1 gap-6 relative z-[-1]">
        <TokenMarquee marqueeData={marqueeData} />
      </div>
      <DropdownFilter onTimeChange={setTime} />
      <DashboardDataTable
        tableLimit={tableLimit}
        setTableLimit={setTableLimit}
        tableData={tableData}
      />
    </div>
  );
};

export default Dashboard;
