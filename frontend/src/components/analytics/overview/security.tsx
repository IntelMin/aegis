'use client';
import React, { useEffect, useState } from 'react';
import PieGraph from './security-pie-chart';
import { Skeleton } from '../../ui/skeleton';
import axios from 'axios';

const SecurityOverview: React.FC<{
  address: string;
}> = ({ address }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
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

  const bgRed = [
    '#dc2626', // red-600
    '#ef4444', // red-500
    '#f87171', // red-400
    '#fca5a5', // red-300
    '#fecaca', // red-200
  ];

  const bgOrange = [
    '#ea580c', // orange-600
    '#f97316', // orange-500
    '#fb923c', // orange-400
    '#fdba74', // orange-300
    '#fed7aa', // orange-200
  ];

  const bgYellow = [
    '#ca8a04', // yellow-600
    '#eab308', // yellow-500
    '#facc15', // yellow-400
    '#fde047', // yellow-300
    '#fde68a', // yellow-200
  ];

  const bgGreen = [
    '#059669', // green-600
    '#10b981', // green-500
    '#34d399', // green-400
    '#6ee7b7', // green-300
    '#a7f3d0', // green-200
  ];

  const getColor = (score: number) => {
    const colorRanges: { [key: string]: number } = {
      red: 25,
      orange: 50,
      yellow: 75,
      green: 100,
    };

    const colorKey =
      Object.keys(colorRanges).find(
        (key: keyof typeof colorRanges) => score <= colorRanges[key]
      ) || 'green';

    let colorArray;
    switch (colorKey) {
      case 'red':
        colorArray = bgRed;
        break;
      case 'orange':
        colorArray = bgOrange;
        break;
      case 'yellow':
        colorArray = bgYellow;
        break;
      case 'green':
        colorArray = bgGreen;
        break;
      default:
        colorArray = bgGreen; // default color
        break;
    }

    return colorArray.map(colorCode => ({ backgroundColor: colorCode }));
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
      {data.map((item: any, index: any) => (
        <div
          key={index}
          className="flex flex-col bg-zinc-900 rounded-md w-full p-3"
        >
          <div className="flex flex-row justify-between pb-1">
            <div className="font-semibold text-lg">{item.label}</div>
            <div className="flex flex-row">
              <div className="w-[80px] flex flex-row-reverse">
                {getColor(item.score)
                  .reverse()
                  .map((color, circleIndex) => (
                    <div
                      key={circleIndex}
                      style={color}
                      className={`w-6 h-6 rounded-full border border-zinc-900 border-[2px] ml-[-0.8rem] z-1${circleIndex}`}
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
