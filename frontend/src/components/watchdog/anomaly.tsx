'use client';

import React, { useImperativeHandle, useEffect, useState, useRef } from 'react';
import { WatchdogSettings } from '@/app/(features)/(free)/watchdog/page';
import { TerminalOutput } from './terminal';
import { Card } from '../ui/card';

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
                <Card
                  key={nonce.current++}
                  className="p-2 whitespace-pre-wrap break-all bg-zinc-800 border-zinc-700 text-gray-500"
                >
                  <p className="text-gray-300">
                    <strong>Honeypot</strong>
                  </p>
                  <p>
                    <span className="text-gray-400">Hash</span> {d.data.hash}
                  </p>
                  <p>
                    <span className="text-gray-400">From</span> {d.data.from}
                  </p>
                  <p>
                    <span className="text-gray-400">To</span> {d.data.to}
                  </p>
                  <p>
                    <span className="text-gray-400">Action</span>{' '}
                    {d.data.action}
                  </p>
                </Card>
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
      className="flex flex-col bg-[#131313] w-full p-4 items-center text-sm h-[600px] overflow-y-auto"
      ref={viewRef}
    >
      <pre className="w-full">Anomalies</pre>
      <div className="space-y-3">{lineData}</div>
    </div>
  );
});

export default Anomaly;
