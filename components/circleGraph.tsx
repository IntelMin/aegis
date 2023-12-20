import React from "react";
import dynamic from "next/dynamic";
import { Props } from "react-apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }) as React.FC<Props>;

type props = {
  value: number;
  height?: number;
};

const CircleGraph = (props: props) => {
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
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: "70%",
          background: "#010101",
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
          background: "#000000",
          strokeWidth: "67%",
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: "#dbd9d9",
            fontSize: "17px",
          },
          value: {
            formatter: function (val: any) {
              return parseInt(val)?.toString();
            },
            color: "#dbd9d9",
            fontSize: "36px",
            show: true,
          },
        },
      },
    },
    fill: {
      colors: ["#ffffff"],
      opacity: 0.9,
      type: 'solid',
      gradient: {
          shade: 'dark',
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
    labels: ["Security Score"],
    // download: false,
  };

  return (
    <div id="card" className="bg-transparent">
      <div id="chart">
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={props.height}
        />
      </div>
    </div>
  );
};

export default CircleGraph;
