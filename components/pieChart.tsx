import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Props } from "react-apexcharts";

type props = {
  detail?: boolean;
};

const ApexChart = (props: props) => {
  const series = [175, 191, 34];
  const customSegmentNames = ["Total", "Success", "Pending"];

  const options: Props["options"] = {
    chart: {
      width: 280,
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      // colors:["white"],
    },
    legend: {
      formatter: function (val: any, opts: any) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      },
    },
    title: {
      text: "",
    },
    labels: customSegmentNames,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 240,
          },
          legend: {
            position: "bottom",
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
        type="donut"
        width={props?.detail ? 340 : 380}
      />
    </div>
  );
};

export default ApexChart;
