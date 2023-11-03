import React from "react";
import Chart, { Props } from "react-apexcharts";

const state: Props["series"] = [
  {
    name: "Series1",
    data: [31, 40, 28, 51, 42, 109, 100, 45, 54, 65, 32, 34, 52, 41, 7, 37, 100, 31, 40, 28, 51, 42, 109, 100, 45, 54, 65, 32, 34, 52, 41, 7, 37, 100, 24, 3, 2, 5, 25, 75, 2, 8 ],
  },
  {
    name: "Series2",
    data: [11, 32, 45, 32, 34, 52, 41, 7, 37, 100, 31, 40, 28, 51, 42, 109, 100, 45, 54, 65, 32, 34, 52, 41, 7, 37, 100, 24, 3, 2, 5, 25, 75, 2, 8, 92,8,5,2,35,14 ],
  },
];

const options: Props["options"] = {
  chart: {
    type: "area",
    animations: {
      easing: "linear",
      speed: 300,
    },
    sparkline: {
      enabled: false,
    },
    brush: {
      enabled: false,
    },
    id: "basic-bar",
    fontFamily: "Inter, sans-serif",
    foreColor: "hsl(var(--nextui-default-800))",
    stacked: true,
    toolbar: {
      show: false,
    },
  },

  xaxis: {
    categories: [],
    labels: {
      // show: false,
      style: {
        colors: "hsl(var(--nextui-default-800))",
        fontFamily: "Inter, sans-serif",
      },
    },
    axisBorder: {
      color: "hsl(var(--nextui-nextui-default-200))",
    },
    axisTicks: {
      color: "hsl(var(--nextui-nextui-default-200))",
    },
  },
  yaxis: {
    labels: {
      style: {
        // hsl(var(--nextui-content1-foreground))
        colors: "hsl(var(--nextui-default-800))",
        fontFamily: "Inter, sans-serif",
      },
    },
  },
  tooltip: {
    enabled: false,
  },
  grid: {
    show: true,
    borderColor: "hsl(var(--nextui-default-200))",
    strokeDashArray: 0,
    position: "back",
  },
  stroke: {
    curve: "smooth",
    fill: {
      colors: ["red"],
    },
  },
  // @ts-ignore
  markers: false,
};

export const Steam = () => {
  return (
    <>
      <div className="w-full z-20">
        <div id="chart">
          <Chart options={options} series={state} type="area" height={425} />
        </div>
      </div>
    </>
  );
};
