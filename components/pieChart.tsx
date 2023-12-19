import dynamic from "next/dynamic";
import { Props } from "react-apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }) as React.FC<Props>;

type Series = {
  detail?: boolean;
};

const ApexChart = (props: Series) => {
  const series = [175, 191, 34];
  const customSegmentNames = ["Total", "Success", "Pending"];
  const colors = ["#CCCCCC", "#999999", "#666666", "#333333", "#000000"];


  const options: Props["options"] = {
    chart: {
      width: 280,
      type: "radialBar",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    // dataLabels: {
    //   enabled: false,
    // },
    tooltip: {
      enabled: true,
    }, 
    colors: colors,
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
            enabled: false,
            position: "bottom",
            fontSize: "14px",
          },
        },
      },
    ],
  };

  return (
    <div id="chart">
      <Chart options={options} series={series} type="donut" width={props?.detail ? 340 : 380} />
    </div>
  );
};

export default ApexChart;
