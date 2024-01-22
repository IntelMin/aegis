'use client';

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import * as d3 from 'd3-hierarchy';
import { Bubble } from 'react-chartjs-2';
import { Skeleton } from '@/components/ui/skeleton';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

type Props = {
  data: any;
};

interface ChartData {
  datasets: {
    label: string;
    data: {
      x: number;
      y: number;
      r: number;
    }[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const options = {
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
    tooltip: {
      callbacks: {
        title: function (tooltipItems: any) {
          return tooltipItems[0].dataset.label;
        },
        label: function (tooltipItem: any) {
          return '';
        },
      },
    },
  },
};

const WalletBubble = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData>({ datasets: [] });

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = props.data;

      let sortedData = fetchedData
        .map((d: { balance: any }) => ({
          ...d,
          balance: Number(d.balance),
        }))
        .sort(
          (a: { balance: number }, b: { balance: number }) =>
            b.balance - a.balance
        );

      const total = sortedData.length;
      const percentile1 = sortedData[Math.floor(total * 0.01)].balance;
      const percentile5 = sortedData[Math.floor(total * 0.05)].balance;
      const percentile10 = sortedData[Math.floor(total * 0.1)].balance;

      // Explicitly setting the type of the hierarchy data to any
      const root = d3
        .hierarchy({ children: sortedData } as any)
        .sum((d: any) => d.balance);

      const diameter = 300;
      const packLayout = d3.pack().size([diameter, diameter]).padding(50);

      const packedData = packLayout(root);

      const chartDataset = {
        datasets: root.leaves().map((node: any) => {
          const balance = parseFloat(node.data.balance);
          const bubbleRadius = node.r;

          let backgroundColor = 'rgba(200, 200, 200, 0.10)';
          let borderColor = '#FFBB0B';

          if (balance >= percentile1) {
            backgroundColor = 'rgba(255, 187, 11, 0.10)';
            borderColor = '#FFBB0B';
          } else if (balance >= percentile5) {
            backgroundColor = 'rgba(11, 255, 80, 0.10)';
            borderColor = '#0BFF50';
          } else {
            backgroundColor = 'rgba(37, 99, 235, 0.10)';
            borderColor = '#2563EB';
          }

          return {
            label: node.data.addressLabel?.label || node.data.address,
            data: [
              {
                x: node.x - diameter / 2,
                y: node.y - diameter / 2,
                r: bubbleRadius,
              },
            ],
            backgroundColor,
            borderColor,
            borderWidth: 0.5,
          };
        }),
      };

      setChartData(chartDataset);
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return <Skeleton className="w-full h-[90%]" />;
  }
  return (
    <div className="w-full h-[320px] translate-y-10">
      <Bubble options={options} data={chartData} />
    </div>
  );
};

export default WalletBubble;
