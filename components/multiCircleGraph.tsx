import dynamic from "next/dynamic";
import { Props } from "react-apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }) as React.FC<Props>;


const MultiCircleGraph = () => {
    const series = [44, 55, 67, 83];
  
    const options: Props['options'] = {
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
            },
            total: {
              show: true,
              label: 'Total',
              formatter: function (w: any) {
                return "249";
              },
            },
          },
        },
      },
      labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
    };
  
    return (
      <div id="chart">
        <Chart options={options} series={series} type="radialBar" height={150} />
      </div>
    );
  };
  
  export default MultiCircleGraph;
  