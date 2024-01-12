import dynamic from 'next/dynamic';
import { Props } from 'react-apexcharts';
import { isViewportValid } from '@/utils/media-query';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
}) as React.FC<Props>;

type Series = {
  detail?: boolean;
};

const ApexChart = (props: Series) => {
  const isMobile = isViewportValid(768);
  const series = [175, 191, 34, 34];
  const customSegmentNames = ['HIGH', 'MEDIUM', 'LOW', 'INORMATIONAL'];
  const colors = ['#60A5FA', '#4ADE80', '#F97316', '#A855F7'];

  const options: Props['options'] = {
    chart: {
      width: 481,
      type: 'radialBar',
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
      },
    },
    stroke: {
      lineCap: 'round',
      width: 1,
      show: false,
    },
    dataLabels: {
      enabled: false,
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
    <div id="chart" className="md:-translate-x-8">
      <Chart
        options={options}
        series={series}
        type="donut"
        width={isMobile ? '100%' : '500px'}
        height={isMobile ? 400 : 180}
      />
    </div>
  );
};

export default ApexChart;
