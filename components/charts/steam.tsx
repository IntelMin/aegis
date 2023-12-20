import React from "react";
import dynamic from "next/dynamic";
import { Props } from "react-apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }) as React.FC<Props>;;

const state: Props["series"] = [
  {
    name: "Series1",
    data: [31, 40, 28, 51, 42, 109, 100],
  },
  {
    name: "Series2",
    data: [11, 32, 45, 32, 34, 52, 41],
  },
];

const options: Props["options"] = {
  legend: {
    show: false,
  },
  fill: {
    colors: ["#ffffff", "#ffffff"],
  },
  chart: {
    type: "area",
    animations: {
      easing: "easeinout",
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
    foreColor: "white",
    stacked: true,
    toolbar: {
      show: false,
    },
  },

  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    labels: {
      show: false,
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
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: ["#ffffff"],
    width: 2,
    dashArray: 0, 
},
  // @ts-ignore
  markers: false,
};

export const Steam = () => {
  return (
    <>
      <div className="w-full z-20">
        <div id="chart">
          <Chart options={options} series={state} type="area" height={425}  />
        </div>
      </div>
    </>
  );
};