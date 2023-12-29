import React from "react";
import dynamic from "next/dynamic";
import { Props } from "react-apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
}) as React.FC<Props>;

type props = {
  value: number;
  height?: number;
};

const PieGraph = (props: props) => {
  const series = [props.value];

  const options: Props["options"] = {
    chart: {
      width: 180,
      height: 180,
      type: "radialBar",
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -115,
        endAngle: 115,
        hollow: {
          margin: 0,
          size: "70%",
          background: "transparent",
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: "front",
          dropShadow: {
            enabled: false,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: "#3F3F46",
          strokeWidth: "100%",
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
              return `${val}%` || "";
            },
            color: "#FAFAFA",
            fontSize: "30px",
            fontWeight: 600,
            show: true,
            offsetY: -20,
          },
          show: true,
          name: {
            offsetY: 30,
            show: true,
            color: "#4ADE80",
            fontWeight: 400,
            fontSize: "20px",
          },
        },
      },
    },
    fill: {
      colors: ["#4ADE80"],
      opacity: 0.9,
      type: "solid",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: true,
        stops: [0, 50, 100],
        opacityFrom: [0.2, 0.8],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Audit Score"],
  };

  return (
    <div id="card" className="bg-transparent p-0 m-0 -translate-x-8">
      <div id="chart">
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={props.height}
          width={"100%"}
        />
      </div>
    </div>
  );
};

export default PieGraph;
