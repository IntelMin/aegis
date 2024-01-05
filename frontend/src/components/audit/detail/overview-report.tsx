import React from 'react';
import TokenPrice from '@/components/monitoring/token-price';
import { demoSecurityScore, demoarr } from './constant';
import TokenValueBox from '@/components/monitoring/token-value-box';
import SecurityScore from './security-score';
import AreaChartComponent from './area-chart';
import AuditHistory from './audit-history';
import AuditDetailChart from './audit-detail-chart';

type Props = {};

const OverViewReport = (props: Props) => {
  const colors = ['#EFF6FF', '#93C5FD', '#1E40AF', '#1E3A8A', '#6366F1'];
  const labels = ['HEALTH', 'SECURITY', 'STRENGTH', 'STABILITY', 'TRUST'];
  const series = [76, 67, 61, 90, 96];
  return (
    <div className="flex flex-col w-full gap-6 px-10 py-12">
      <div className="grid items-center grid-cols-11 gap-5">
        <div className="flex items-center justify-between col-span-6">
          <TokenPrice price="$123.97" profit="3.36" />
        </div>
        <div className="flex items-center col-span-5 gap-3">
          {demoarr?.map(item => (
            <TokenValueBox key={item?.key} item={item} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-11 gap-5">
        <div className="flex flex-col col-span-6 gap-5">
          {/* Security Score */}
          <SecurityScore demoSecurityScore={demoSecurityScore} />
          {/* Area Graph Representation */}
          <div className="w-full p-6 border border-zinc-900">
            <AreaChartComponent />
          </div>
        </div>
        <div className="flex flex-col col-span-5 gap-5">
          {/* Audit History */}
          <AuditHistory />
          {/* Audit Details */}
          <div className="flex flex-col w-full gap-4 p-6 border border-zinc-900">
            <h3 className="text-neutral-200 text-[20px] font-[600] border-b border-zinc-900 pb-3">
              Audit Details
            </h3>
            <div className="flex items-center justify-between">
              <AuditDetailChart />
              <div className="flex flex-col gap-6">
                {labels?.map((item, i) => (
                  <div key={item} className="flex items-center gap-3">
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
