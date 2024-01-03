import React from 'react';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

interface SparklineData {
  timeInterval: { minute: string };
  high: number;
  low: number;
  open: string;
  close: string;
}

interface SparkLineProps {
  data: SparklineData[];
}

const SparkLine: React.FC<SparkLineProps> = ({ data }) => {
  // Transform the data into a suitable format for Recharts, if necessary
  const transformedData = data.map(item => ({
    ...item,
    open: parseFloat(item.open),
    close: parseFloat(item.close),
  }));

  // Determine stroke color based on the last two close values
  const lastClose = transformedData[transformedData.length - 1]?.close;
  const secondLastClose = transformedData[transformedData.length - 2]?.close;
  const strokeColor = lastClose > secondLastClose ? '#4ADE80' : '#FF0000';

  return (
    <ResponsiveContainer width={100} height={32}>
      <LineChart width={100} height={32} data={transformedData}>
        <YAxis hide domain={['auto', 'auto']} />
        <Line
          type="monotone"
          dataKey="close"
          stroke={strokeColor}
          strokeWidth={1}
          fillOpacity={1}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparkLine;
