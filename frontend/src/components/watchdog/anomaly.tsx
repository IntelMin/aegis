'use client';

import React, { useImperativeHandle, useEffect, useState, useRef } from 'react';
import { WatchdogSettings } from '@/app/(features)/(free)/watchdog/page';
import { TerminalOutput } from './terminal';

interface AnomalyProps {
  settings: WatchdogSettings;
}

const Anomaly = React.forwardRef(function AnomalyComponent(
  props: BlockStatusProps,
  ref
) {
  const [lineData, setLineData] = useState<React.ReactNode[]>([]);
  const viewRef = useRef<HTMLDivElement>(null);

  const update = (data: any) => {
    if (props.settings.honeypot || true) {
      setLineData(prev =>
        prev
          .concat(
            data
              .filter((d, key) => d.type === 'tx')
              .map((d, key) => (
                <TerminalOutput key={key}>
                  <pre className="whitespace-pre-wrap break-all">
                    Honeypot:
                    {'\n'}
                    {d.data.hash}
                    {'\n'}
                    {'├── FROM    '}
                    {d.data.from}
                    {'\n'}
                    {'│    └─ TO  '}
                    {d.data.to}
                    {'\n'}
                    {'└── ACTION  '}
                    {d.data.action}
                  </pre>
                </TerminalOutput>
              ))
          )
          .slice(-50)
      );
    }
  };

  useEffect(() => {
    viewRef.current?.scrollIntoView({
      behavior: 'instant',
      block: 'end',
    });
  }, [lineData]);

  useImperativeHandle(ref, () => ({
    update,
    clear: () => setLineData([]),
  }));

  return (
    <div
      className="flex flex-col bg-[#131313] w-full p-4 items-center text-sm text-[#aaaaaa] h-[600px] overflow-y-auto"
      ref={viewRef}
    >
      <pre className="w-full">Anomalies</pre>
      {lineData}
    </div>
  );
});

export default Anomaly;
