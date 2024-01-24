import React from 'react';
import dynamic from 'next/dynamic';
import { Props } from 'react-apexcharts';
import { isViewportValid } from '@/utils/media-query';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
}) as React.FC<Props>;

const FindingsGraph = (props: {}) => {
  const isMobile = isViewportValid(768);
  const series = [0, 1, 0, 0];
  const customSegmentNames = ['HIGH', 'MEDIUM', 'LOW', 'INORMATIONAL'];
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
      position: 'left',
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
  return (
    <div className="w-full p-6 border border-zinc-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h3 className="text-neutral-200 text-md font-semibold">Findings</h3>
      </div>
      <div className="flex items-center h-full py-8">
        <div id="chart" className="md:-translate-x-4">
          <Chart options={options} series={series} type="donut" width={300} />
        </div>
      </div>
    </div>
  );
};

export default FindingsGraph;
