"use client";

import React from "react";

import Chart, { Props } from "react-apexcharts";

const TokenChart = () => {
  const options: Props["options"] = {
    chart: {
      width: 180,
    },
    xaxis: {
      labels: {
        show: false,
      },
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    fill: {
      colors: ["transparent"],
    },
    stroke: {
      colors: ["green"],
    },
    grid: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        // endingShape: "flat",
        columnWidth: "100%", // Adjust the column width if needed
      },
    },
    // @ts-ignore
    markers: false,
  };
  const series = [
    {
      name: "series-3",
      data: [24, 20, 5, 75, 42, 79, 72, 35],
    },
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full translate-y-[50px] z-[1]">
      <Chart options={options} series={series} type="area" />
    </div>
  );
};
export default TokenChart;
