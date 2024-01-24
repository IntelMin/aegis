'use client';

import React, { useImperativeHandle, useEffect, useState, useRef } from 'react';
import { WatchdogSettings } from '@/app/(features)/(free)/watchdog/page';
import { TerminalOutput } from './terminal';
import { Card } from '../ui/card';
import Link from 'next/link';
import { formatAddress } from '@/utils/format-address';

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
              .filter((d: any) => d.type === 'tx')
              // .filter((d: any) => d.type === 'honeypot')
              .map((d: any) => (
                <Card
                  key={nonce.current++}
                  className="p-2 whitespace-pre-wrap break-all bg-zinc-800 border-zinc-700 text-gray-500"
                >
                  <p className="text-gray-300">
                    <strong>Honeypot</strong>
                  </p>
                  <p>
                    <Link
                      className="text-gray-400 hover:underline"
                      target="_blank"
                      href={`https://etherscan.io/tx/${d.data.hash}`}
                    >
                      View TX
                    </Link>
                  </p>
                  <p>
                    <Link
                      className="text-gray-400 hover:underline"
                      target="_blank"
                      href={`https://etherscan.io/address/${d.data.fromAddr}`}
                    >
                      {d.data.from === d.data.fromAddr
                        ? formatAddress(d.data.from)
                        : d.data.from}
                    </Link>
                    &nbsp;
                    {d.data.action}
                    &nbsp;to&nbsp;
                    <Link
                      className="text-gray-400 hover:underline"
                      target="_blank"
                      href={`https://etherscan.io/address/${d.data.toAddr}`}
                    >
                      {d.data.to === d.data.toAddr
                        ? formatAddress(d.data.to)
                        : d.data.to}
                    </Link>
                  </p>
                </Card>
              ))
          )
          .slice(-50)
      );
    }
  };

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.scrollTo(0, viewRef.current.scrollHeight);
    }
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
