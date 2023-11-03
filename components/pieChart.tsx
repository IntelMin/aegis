import Chart, { Props } from "react-apexcharts";

const ApexChart = () => {
  const series = [175, 191, 34];
  const customSegmentNames = ["Total", "Success", "Pending"];

  const options = {
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
      color:"white",
    },
    legend: {
      formatter: function (val: any, opts: any) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      }
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
            width: 200,
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
      <Chart options={options} series={series} type="donut" width={380} />
    </div>
  );
};

export default ApexChart;
