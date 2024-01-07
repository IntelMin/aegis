import React from 'react';
import Image from 'next/image';

function Findings({ findings }: any) {
  return (
    <div className="flex-1 h-full pr-5 space-y-6 overflow-y-scroll">
      {findings?.length > 0 ? (
        findings.map((finding: any, index: number) => (
          <div
            key={index}
            className="bg-zinc-900 min-h-[76px] ml-5 max-w-[300px] flex-cols items-center gap-3 space-y-6 text-white p-6"
          >
            <button className="px-3 py-2 text-sm font-semibold text-white uppercase border-2 rounded-full border-zinc-600">
              <b className="animate-pulse mx-0.5">
                {finding.severity === 'INFO'
                  ? '🔵'
                  : finding.severity === 'MEDIUM'
                  ? '🟠'
                  : finding.severity === 'LOW'
                  ? '🟡'
                  : '🔴'}
              </b>{' '}
              {finding.severity}
            </button>
            <h1 className="font-semibold text-md">{finding.vulnerability}</h1>
            <p className="text-xs">{finding.reason}</p>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full bg-zinc-800">
          <Image
            src="/icons/findings-empty.svg"
            width={120}
            height={120}
            alt="No findings"
          />
          <h1 className="text-sm text-white">No findings available</h1>
        </div>
      )}
    </div>
  );
}

export default Findings;
