'use client';
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { formatYAxisLabel } from '@/utils/formatYaxisLabel';
import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Jan',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Feb',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Mar',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Apr',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'May',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Jun',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Jan',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Feb',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Mar',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Apr',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'May',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Jun',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

type Props = {};

const HoldersGraph = (props: Props) => {
  const [isLoading, setLoading] = useState(true);
  const labelStyle = {
    color: '#A3A3A3',
    textAlign: 'center',
    fontSize: '12px',
    fontStyle: 'normal',
  };

  useEffect(() => {
    const loadData = async () => {
      // Made this timeout to show the skeleton loading will remove when api is ready
      setTimeout(() => setLoading(false), 2000);
    };

    loadData();
  }, []);

  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }
  return (
    <div className="w-full h-[100%]">
      <ResponsiveContainer width="120%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis
            axisLine={{ stroke: '#333', strokeWidth: 1 }}
            tickLine={{ display: 'none' }}
            dataKey="name"
            tick={{ ...labelStyle }}
          />
          <YAxis
            axisLine={{ display: 'none' }}
            tickLine={{ display: 'none' }}
            tickFormatter={value => formatYAxisLabel(value)}
            tick={{ ...labelStyle }}
            orientation="right"
          />
          <CartesianGrid stroke="#171717" vertical={false} />
          <Area
            type="monotone"
            dataKey="uv"
            strokeWidth={2}
            stroke="#47A3FF"
            fill="rgba(71, 163, 255, 0.10)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HoldersGraph;
