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
const PieGraph = (props: props) => {
  const series = [props.value];

  const colors =
    props.value <= 25
      ? '#dc2626'
      : props.value <= 50
      ? '#ea580c'
      : props.value <= 75
      ? '#ca8a04'
      : '#059669';

  const options: Props['options'] = {
    chart: {
      width: 180,
      height: 180,
      type: 'radialBar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -115,
        endAngle: 115,
        hollow: {
          margin: 0,
          size: '70%',
          background: 'transparent',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: false,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: '#3F3F46',
          strokeWidth: '100%',
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },
        dataLabels: {
          value: {
            formatter: function (val: any) {
              return (props.labels ? `${val}%` : `${val}/100`) || '';
            },
            color: colors,
            fontSize: '30px',
            fontWeight: 600,
            show: true,
            offsetY: props.labels ? -20 : 0,
          },
          show: true,
          name: {
            offsetY: 30,
            show: props.labels,
            color: '#666',
            fontWeight: 400,
            fontSize: '14px',
          },
        },
      },
    },
    fill: {
      colors: [colors],
      opacity: 0.9,
      type: 'solid',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: true,
        stops: [0, 50, 100],
        opacityFrom: [0.2, 0.8],
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Safety Overview'],
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: 380,
          },
        },
      },
    ],
  };

  return (
    <div id="chart">
      <Chart
        options={options}
        series={series}
        type="radialBar"
        height={props.height}
        width={'100%'}
      />
    </div>
  );
};

export default PieGraph;
