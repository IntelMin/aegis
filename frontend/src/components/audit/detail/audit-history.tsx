import React from 'react';
import ApexChart from '@/components/audit/detail/pie-chart';

type Props = {};

const AuditHistory = (props: Props) => {
  return (
    <div className="w-full p-6 border border-zinc-900">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-3">
        <h3 className="text-neutral-200 text-[20px] font-[600] max-md:py-4 max-md:pb-4 max-md:border-b max-md:border-zinc-900">
          Audit History
        </h3>
        <div className="flex items-center gap-2 max-md:py-4 max-md:pb-4 max-md:border-b max-md:border-zinc-900">
          <p className="text-neutral-200 font-[16px]">500+</p>
          <p className="text-neutral-200 font-[16px]">
            +3.5% from the last week
          </p>
        </div>
      </div>
      {/* Audit history Chart and detail */}
      <div className="flex items-center w-full py-8">
        <ApexChart detail={true} />
      </div>
    </div>
  );
};

export default AuditHistory;
