"use client"; 
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

type Props = {};

const TokenGaugeChart = (props: Props) => {
  const [chartData, setChartData] = useState({
    series: [67],
    options: {
      chart: {
        height: 350,
        offsetY: -10,
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: "16px",
              color: "white",
              offsetY: 120,
            },
            value: {
              offsetY: -20,
              fontSize: "30px",
              color: "gray",
              formatter: function (val: any) {
                return `${val}/100`; 
              },
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          colorStops: [
            {
              offset: 0,
              color: "#EF4444",
              opacity: 1,
            },
            {
              offset: 100,
              color: "#EF4444",
              opacity: 1,
            },
          ],
        },
      },
      labels: ["Heavily Compromised"],
    },
  });

  return (
    <div className="border border-zinc-900 p-2 flex flex-col gap-6 mt-3">
      <p className="text-white">Safety Overview</p>

      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="radialBar"
          height={350}
        />
        <p className="text-white">Heavily Compromised</p>
      </div>
    </div>
  );
};

export default TokenGaugeChart;
