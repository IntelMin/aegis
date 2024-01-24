'use client';

import React, { useImperativeHandle, useEffect, useState, useRef } from 'react';
import { WatchdogSettings } from '@/app/(features)/(free)/watchdog/page';
import { TerminalOutput } from './terminal';

interface AnomalyProps {
  settings: WatchdogSettings;
}

const Anomaly = React.forwardRef(function AnomalyComponent(
  props: AnomalyProps,
  ref
) {
  const [lineData, setLineData] = useState<React.ReactNode[]>([]);
  const viewRef = useRef<HTMLDivElement>(null);
  const nonce = useRef<number>(0);

  const update = (data: any) => {
    if (props.settings.honeypot) {
      setLineData(prev =>
        prev
          .concat(
            data
              .filter((d: any) => d.type === 'honeypot')
              .map((d: any) => (
                <TerminalOutput key={nonce.current++}>
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
    viewRef.current?.scrollTo(0, viewRef.current.scrollHeight);
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
