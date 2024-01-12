import React from 'react';
import { Props } from 'react-apexcharts';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
}) as React.FC<Props>;

const AuditDetailChart = () => {
  const series = [76, 67, 61, 90, 96];
  const options: Props['options'] = {
    chart: {
      height: 300,
      width: 400,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        offsetY: 15,
        offsetX: 50,
        startAngle: 0,
        endAngle: 360,
        hollow: {
          margin: 1,
          size: '30%',
          background: 'transparent',
          image: undefined,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
      },
    },
    stroke: {
      lineCap: 'round',
      width: 1,
    },
    colors: ['#EFF6FF', '#93C5FD', '#1E40AF', '#1E3A8A', '#6366F1'],
    labels: ['HEALTH', 'SECURITY', 'STRENGTH', 'STABILITY', 'TRUST'],
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
            width: 500,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  return (
    <div id="chart" className="-translate-x-[50px]">
      <Chart
        options={options}
        series={series}
        type="radialBar"
        height={300}
        width={'110%'}
      />
    </div>
  );
};

export default AuditDetailChart;
