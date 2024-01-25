import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TokenAuditHead from '@/components/analytics/header';
import { demoSecurityScore, demoarr } from './constant';
import SecurityScore from './security-score';
import AreaChartComponent from './area-chart';
import AuditHistory from './findings-graph';
import AuditDetailChart from './audit-detail-chart';
import useLiveData from '@/hooks/useLiveData';

type Props = {
  token: string;
  data: any;
};

const OverViewReport = (props: Props) => {
  const colors = ['#EFF6FF', '#93C5FD', '#1E40AF', '#1E3A8A', '#6366F1'];
  const labels = ['HEALTH', 'SECURITY', 'STRENGTH', 'STABILITY', 'TRUST'];
  const series = [76, 67, 61, 90, 96];

  const liveData = useLiveData(props?.token);

  return (
    <div className="flex flex-col w-full gap-6 px-3 md:px-10 py-12">
      <TokenAuditHead
        showTitle={true}
        liveData={liveData}
        metadata={props?.data.metadata}
      />
      <div className="grid grid-cols-11 gap-5">
        <div className="flex flex-col col-span-11 md:col-span-6 gap-5">
          {/* Security Score */}
          <SecurityScore demoSecurityScore={demoSecurityScore} />
          {/* Area Graph Representation */}
          <div className="w-full p-6 border border-zinc-900">
            <AreaChartComponent />
          </div>
        </div>
        <div className="flex flex-col col-span-11 md:col-span-5 gap-5">
          {/* Audit History */}
          <AuditHistory />
          {/* Audit Details */}
          <div className="flex flex-col w-full gap-4 p-6 border border-zinc-900">
            <h3 className="text-neutral-200 text-[20px] font-[600] border-b border-zinc-900 pb-3">
              Audit Details
            </h3>
            <div className="flex max-md:flex-col items-center justify-between">
              <AuditDetailChart />
              <div className="flex flex-col gap-3 max-md:w-full">
                {labels?.map((item, i) => (
                  <div
                    key={item}
                    className="flex items-center max-md:w-full max-md:justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-[16px] h-[16px] rounded-full`}
                        style={{
                          backgroundColor: colors[i],
                        }}
                      />
                      <p className="text-neutral-200 text-[16px] tracking-[1px]">
                        {item}:
                      </p>
                    </div>
                    <p>{series[i]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverViewReport;
