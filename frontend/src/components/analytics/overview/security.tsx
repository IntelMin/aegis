'use client';
import React, { useEffect, useMemo, useState } from 'react';
import PieGraph from './security-pie-chart';
import { Skeleton } from '../../ui/skeleton';
import axios from 'axios';
import RadarGraph from './security-radar';
import SecurityScale from './security-scale';

const SecurityOverview: React.FC<{
  address: string;
  showRadar: boolean;
  showDetails: boolean;
}> = ({ address, showRadar, showDetails }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [score, setScores] = useState({} as any);
  const [total, setTotal] = useState(0);

  useMemo(() => {
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

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[320px] aspect-square" />;
  }
  return (
    <div className="border border-zinc-900 p-3 flex flex-col items-center justify-center gap-3">
      {/* <p className="text-white">Safety Overview</p> */}
      <div className="flex flex-row justify-between w-full">
        <PieGraph value={total} height={290} labels={true} />
        {showRadar && <RadarGraph value={total} height={250} labels={true} />}
      </div>
      {!showRadar && (
        <p className="text-zinc-200 text-center font-bold mb-3">
          {total < 50
            ? 'Caution Advised'
            : total < 20
            ? 'High Risk'
            : 'Neutral Risk'}
        </p>
      )}

      {showDetails && (
        <>
          {data.map((item: any, index: any) => (
            <div
              key={index}
              className="flex flex-col bg-zinc-900 rounded-md w-full p-3"
            >
              <div className="flex flex-row justify-between pb-1">
                <div className="font-semibold text-lg">{item.label}</div>
                <SecurityScale value={item.score} />
              </div>
              <div className="text-zinc-500 text-lg">{item.description}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SecurityOverview;
