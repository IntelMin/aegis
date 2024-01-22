'use client';
import React, { useEffect, useState } from 'react';
import PieGraph from './security-pie-chart';
import { Skeleton } from '../../ui/skeleton';
import axios from 'axios';

const SecurityOverview: React.FC<{
  address: string;
}> = ({ address }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [score, setScores] = useState({} as any);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!address) return;

    setLoading(true);

    const loadData = async () => {
      const response = await axios.get(
        `/api/token/info?address=${address}&type=scan`
      );

      const data = response.data;

      setTotal(Math.round(data.auditScore));

      setData([
        {
          score: data.securityScore,
          label: 'Security',
          description:
            data.securityScore < 50
              ? 'Owners have some control'
              : data.securityScore < 25
              ? 'Practice Caution'
              : 'No suspicious activity',
        },
        {
          score: data.decentralisationScore,
          label: 'Governance',
          description:
            data.decentralisationScore < 50
              ? 'Slightly centralized'
              : data.decentralisationScore < 25
              ? 'Centralized'
              : 'Sufficiently decentralized',
        },
        {
          score: data.communityScore,
          label: 'Community',
          description:
            data.communityScore < 50
              ? 'Growth needed'
              : data.communityScore < 25
              ? 'Not enough activity'
              : 'Very active community',
        },
        {
          score: data.marketScore,
          label: 'Market',
          description:
            data.marketScore < 50
              ? 'Low trading'
              : data.marketScore < 25
              ? 'Not enough trading'
              : 'Active trading',
        },
      ]);
      //   console.log('response', response);
      setLoading(false);
    };

    loadData();
  }, [address]);

  const getColor = (score: number) => {
    const colorRanges = {
      red: 25,
      orange: 50,
      yellow: 75,
      green: 100,
    };

    const color =
      Object.keys(colorRanges).find(key => score <= colorRanges[key]) ||
      'green';
    return Array.from({ length: 5 }, (_, i) => `bg-${color}-${100 + i * 100}`);
  };

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[320px] aspect-square" />;
  }
  return (
    <div className="border border-zinc-900 p-3 flex flex-col items-center justify-center gap-3">
      {/* <p className="text-white">Safety Overview</p> */}
      <PieGraph value={total} height={290} labels={true} />
      <p className="text-zinc-200 text-center font-bold mb-3">
        {total < 50
          ? 'Caution Advised'
          : total < 20
          ? 'High Risk'
          : 'Neutral Risk'}
      </p>
      {data.map((item, index) => (
        <div
          key={index}
          className="flex flex-col bg-zinc-900 rounded-md w-full p-3"
        >
          <div className="flex flex-row justify-between pb-1">
            <div className="font-semibold text-lg">{item.label}</div>
            <div className="flex flex-row">
              <div className="w-[80px] flex flex-row-reverse">
                {getColor(item.score).map((color, circleIndex) => (
                  <div
                    key={circleIndex}
                    className={`w-6 h-6 ${color} rounded-full border border-zinc-900 border-[2px] ml-[-0.8rem] z-${circleIndex}`}
                  />
                ))}
              </div>

              <div className="ml-2 w-[30px] font-bold text-lg text-right text-zinc-200 font-mono">
                {item.score}%
              </div>
            </div>
          </div>
          <div className="text-zinc-500 text-lg">{item.description}</div>
        </div>
      ))}
    </div>
  );
};

export default SecurityOverview;
