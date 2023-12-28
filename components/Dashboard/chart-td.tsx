"use client";

import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    YAxis
} from "recharts";

const ChartTd = () => {
  const dummyData = Array.from({ length: 20 }, (_, index) => ({
    name: `Day ${index + 1}`,
    val: Math.random() * 1000,
  }));
  return (
    <ResponsiveContainer width={100} height={32}>
      <LineChart width={100} height={32} data={dummyData}>
        <Tooltip />
        <YAxis hide domain={["auto", "auto"]} />
        <Line
          type="monotone"
          dataKey="val"
          stroke="#4ADE80"
          strokeWidth={1}
          fillOpacity={1}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartTd;
