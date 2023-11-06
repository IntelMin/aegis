import dynamic from "next/dynamic";
import { Props } from "react-apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const RadialChart = () => {
  const series = [76, 67, 61, 90, 96];
  const options: Props["options"] = {
    chart: {
      height: 390,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        offsetY: 15,
        offsetX: 50,
        startAngle: 0,
        endAngle: 270,
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
    colors: ['#1aeae0', '#00d1ab', '#00ac81', '#008a71', '#005243'],
    labels: ['Health', 'Security', 'Strength', 'Stability', 'Trust'],
    legend: {
      show: true,
      floating: true,
      fontSize: '12px',
      position: 'left',
      offsetX: 200,
      offsetY: 10,
      labels: {
        useSeriesColors: true,
      },
      formatter: function (seriesName: any, opts: any) {
        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
      },
      itemMargin: {
        vertical: 1.5,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
          legend: {
            show: false,
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
        height={350}
      />
    </div>
  );
};

export default RadialChart;
