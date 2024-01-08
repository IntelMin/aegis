'use client';

import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

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

const LiquidityReportData = {
  datasets: [
    {
      label: 'Liquidity Data',
      data: Array.from({ length: 30 }, generateRandomData),
      backgroundColor: 'rgba(37, 99, 235, 0.10)',
      borderColor: '#2563EB',
      borderWidth: 0.5,
    },
  ],
};

export const LiquidityReportChart = (props: Props) => {
  return (
    <div className="w-full h-[320px]">
      <Bubble options={options} data={LiquidityReportData} />
    </div>
  );
};
