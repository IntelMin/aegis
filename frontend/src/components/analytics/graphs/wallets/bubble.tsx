'use client';
'use client';

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { Skeleton } from '@/components/ui/skeleton';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

type Props = {
  type?: string;
};

export const options = {
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
      beginAtZero: true,
    },
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const generateRandomData = () => ({
  x: faker.datatype.number({ min: -10, max: 10 }),
  y: faker.datatype.number({ min: -10, max: 10 }),
  r: faker.datatype.number({ min: 5, max: 20 }),
});

export const data = {
  datasets: [
    {
      label: 'First dataset',
      data: Array.from({ length: 10 }, generateRandomData),
      backgroundColor: 'rgba(255, 187, 11, 0.10)',
      borderColor: '#FFBB0B',
      borderWidth: 0.5,
    },
    {
      label: 'Second dataset',
      data: Array.from({ length: 5 }, generateRandomData),
      backgroundColor: 'rgba(11, 255, 80, 0.10)',
      borderColor: '#0BFF50',
      borderWidth: 0.5,
    },
    {
      label: 'Third dataset',
      data: Array.from({ length: 5 }, generateRandomData),
      backgroundColor: 'rgba(37, 99, 235, 0.10)',
      borderColor: '#2563EB',
      borderWidth: 0.5,
    },
  ],
};

const WalletBubble = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Made this timeout to show the skeleton loading will remove when api is ready.
      setTimeout(() => setIsLoading(false), 1000);
    };

    loadData();
  }, []);

  if (isLoading) {
    return <Skeleton className="w-full h-[90%]" />;
  }
  return (
    <div className="w-full h-[320px]">
      <Bubble options={options} data={data} />
    </div>
  );
};

export default WalletBubble;
