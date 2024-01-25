import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Props } from 'react-apexcharts';
import { isViewportValid } from '@/utils/media-query';
import PieChart from './pie-chart';
import { Skeleton } from '@/components/ui/skeleton';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
}) as React.FC<Props>;

interface GovernanceInfoProps {
  address: string;
}

const FindingsGraph: React.FC<GovernanceInfoProps> = ({ address }) => {
  const isMobile = isViewportValid(768);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const series = [0, 1, 0, 0];
  const customSegmentNames = ['HIGH', 'MEDIUM', 'LOW', 'INFO'];
  const colors = ['#F97316', '#FCD34D', '#A855F7', '#60A5FA'];

  const options: Props['options'] = {
    chart: {
      type: 'donut',
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '12px',
    },
    stroke: {
      lineCap: 'round',
      width: 1,
      show: false,
    },
    dataLabels: {
      enabled: false,
      formatter: function (val: any) {
        return val;
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      enabled: true,
    },
    colors: colors,
    title: {
      text: '',
    },
    labels: customSegmentNames,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 340,
          },
          legend: {
            enabled: false,
            position: 'bottom',
            fontSize: '14px',
          },
        },
      },
    ],
  };

  useMemo(() => {
    if (!address) return;

    setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
  }, [address]);

  if (!isLoaded) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <div className="w-full p-3 border border-zinc-900 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h3 className="text-zinc-200 text-md font-semibold">Findings</h3>
      </div>
      <div className="flex items-center justify-center h-full">
        <div id="chart" className="">
          <Chart
            options={options}
            series={series}
            type="donut"
            width={300}
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default FindingsGraph;
