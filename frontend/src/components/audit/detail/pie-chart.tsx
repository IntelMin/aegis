import dynamic from 'next/dynamic';
import { Props } from 'react-apexcharts';
import { isViewportValid } from '@/utils/media-query';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
}) as React.FC<Props>;

type Series = {
  detail?: boolean;
};

const PieChart = (props: Series) => {
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
    <div id="chart" className="md:-translate-x-4">
      <Chart
        options={options}
        series={series}
        type="donut"
        width={300}
        height={400}
      />
    </div>
  );
};

export default PieChart;
