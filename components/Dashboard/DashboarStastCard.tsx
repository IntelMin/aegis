import React, { ReactNode } from 'react';
import { Card } from '@nextui-org/react';

interface DashboardStatsCardProps {
  data: {
    [key: string]: number;
  };
  children?: ReactNode;
}

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({ data, children }: DashboardStatsCardProps) => {
  const [key, value] = Object.entries(data)[0];

  return (
    <Card className='w-[15%] p-4 mr-2 bg-opacity-50 w-full md:w-[80%] bg-gradient-to-tl from-[#1b1b1bbd] via-[#1b1b1bbd] to-gray-700'>
      <div className='text-center text-2xl font-bold'>{value}</div>
      <div className='text-center'>{key}</div>
      {children}
    </Card>
  );
};

export default DashboardStatsCard;
