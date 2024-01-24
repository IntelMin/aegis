import React from 'react';
import dynamic from 'next/dynamic';
import { Props } from 'react-apexcharts';
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
}) as React.FC<Props>;

type props = {
  value: number;
  height?: number;
  labels?: boolean;
};
const RadarGraph = (props: props) => {
  const series = [
    {
      name: 'Score',
      data: [80, 50, 30, 40],
    },
  ];

  const options: Props['options'] = {
    chart: {
      type: 'radar',
      toolbar: {
        show: false,
      },
    },
    fill: {
      colors: ['#fff'],
      opacity: 0.2,
      type: 'solid',
    },
    stroke: {
      lineCap: 'round',
      width: 1,
      dashArray: 0,
      colors: ['#e9e9e9', '#000'],
    },
    markers: {
      size: 2,
      hover: {
        size: 10,
      },
      colors: ['#fff'],
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: '#18181b',
          fill: {
            colors: ['#18181b', '#000'],
          },
          connectorColors: '#3b3b41',
        },
      },
    },

    xaxis: {
      categories: ['Security', 'Governance', 'Community', 'Market'],
      labels: {
        show: props.labels,
        style: {
          colors: '#eee',
        },
      },
    },
    tooltip: {
      theme: 'dark',
    },
  };

  return (
    <div id="card" className="bg-transparent p-0 m-0">
      <div id="chart">
        <Chart
          options={options}
          series={series}
          type="radar"
          height={props.height}
          width={'100%'}
        />
      </div>
    </div>
  );
};

export default RadarGraph;
