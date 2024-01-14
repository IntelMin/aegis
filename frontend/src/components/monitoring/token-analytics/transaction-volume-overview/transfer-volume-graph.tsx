'use client';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { formatYAxisLabel } from '@/utils/formatYaxisLabel';
import axios from 'axios';

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

interface RoundedBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}

const RoundedBar: React.FC<RoundedBarProps> = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill,
}) => {
  const radius = 3;
  const path = `M${x},${y + radius}
                A${radius},${radius},0,0,1,${x + radius},${y}
                L${x + width - radius},${y}
                A${radius},${radius},0,0,1,${x + width},${y + radius}
                L${x + width},${y + height - radius}
                A${radius},${radius},0,0,1,${x + width - radius},${y + height}
                L${x + radius},${y + height}
                A${radius},${radius},0,0,1,${x},${y + height - radius}
                Z`;
  return <path d={path} fill={fill} />;
};

const TransferVolumeGraph: React.FC<RoundedBarProps> = () => {
  const labelStyle = {
    color: '#A3A3A3',
    textAlign: 'center',
    fontSize: '12px',
    fontStyle: 'normal',
  };

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const config = {
      exchangeAddress: '0xcA143Ce32Fe78f17019d7d551a6402fC5350c73',
      baseCurrency: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      quoteCurrency: '0xB09FE1613fe03E7361319d2a3eDeC17a22f36809',
    };
    const loadData = async () => {
      const response = await axios.post(`/monitoring/volume`, config);
      console.log('response', response);
      setLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="110%" height="100%">
        <BarChart width={150} height={40} data={data}>
          <XAxis
            axisLine={{ stroke: '#333', strokeWidth: 1 }}
            tickLine={{ display: 'none' }}
            dataKey="name"
            tick={{ ...labelStyle }}
          />

          <YAxis
            axisLine={{ display: 'none' }}
            tickLine={{ display: 'none' }}
            // Replace 'formatYAxisLabel' with your actual function
            tickFormatter={value => formatYAxisLabel(value)}
            tick={{ ...labelStyle }}
            orientation="right"
          />
          <CartesianGrid stroke="#171717" vertical={false} />
          <CartesianGrid stroke="#171717" vertical={false} />
          <Bar
            dataKey="uv"
            fill="#0284C7"
            barSize={10}
            shape={<RoundedBar />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransferVolumeGraph;
