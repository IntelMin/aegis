import dynamic from "next/dynamic";
import { Props } from "react-apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
}) as React.FC<Props>;

type Series = {
  detail?: boolean;
};

const ApexChart = (props: Series) => {
  const series = [175, 191, 34, 34];
  const customSegmentNames = ["HIGH", "MEDIUM", "LOW", "INORMATIONAL"];
  const colors = ["#60A5FA", "#4ADE80", "#F97316", "#A855F7"];

  const options: Props["options"] = {
    chart: {
      width: 481,
      type: "radialBar",
    },
    plotOptions: {
      pie: {
        startAngle: -95,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: false,
    },
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
    <div id="chart" className="-translate-x-8">
      <Chart
        options={options}
        series={series}
        type="donut"
        width={"500px"}
        height={180}
      />
    </div>
  );
};

export default ApexChart;
