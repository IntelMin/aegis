'use client';
import React from 'react';
import PieGraph from '../security-pie-chart';

type Props = {};

const TokenSecurityScoreChart = (props: Props) => {
  return (
    <div className="border border-zinc-900 p-2 flex flex-col gap-6 mt-3">
      <p className="text-white">Safety Overview</p>
      <PieGraph value={43} height={280} labels={false} />
      <p className="text-white">Heavily Compromised</p>
    </div>
  );
};

export default TokenSecurityScoreChart;
