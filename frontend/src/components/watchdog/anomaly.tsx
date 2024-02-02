'use client';

import React, { useImperativeHandle, useEffect, useState, useRef } from 'react';
import { WatchdogSettings } from '@/app/(features)/(free)/watchdog/page';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { formatAddress } from '@/utils/format-address';
import SecurityScale from '../analytics/overview/security-scale';
import { Badge } from '../ui/badge';
import { CheckIcon } from '@radix-ui/react-icons';
import { LinkIcon, ViewIcon } from 'lucide-react';
import { Progress } from '../ui/progress';
import { formatNumber } from '@/utils/format-number';

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
  const lineDataLengthRef = useRef(lineData.length);

  const HoneypotItem = (d: any) => {
    return (
      <Card
        key={nonce.current++}
        className="p-2 whitespace-pre-wrap break-all bg-zinc-800 border-zinc-700 text-gray-500"
      >
        <div className="flex justify-between items-center mb-2">
          <strong className="text-gray-300">Honeypot</strong>
          <Button asChild size="sm" className="h-6">
            <Link
              className="dark:text-gray-400 px-1 dark:bg-zinc-700 hover:dark:bg-zinc-600"
              target="_blank"
              href={`https://etherscan.io/tx/${d.data.hash}`}
            >
              View TX
            </Link>
          </Button>
        </div>
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
            {d.data.to === d.data.toAddr ? formatAddress(d.data.to) : d.data.to}
          </Link>
        </p>
      </Card>
    );
  };

  const combineRiskDetails = (details: any) => {
    const combined = details.reduce((acc: any, detail: any) => {
      if (acc[detail.label]) {
        acc[detail.label].volume += detail.volume;
        acc[detail.label].percent += detail.percent;
      } else {
        acc[detail.label] = { ...detail };
      }
      return acc;
    }, {});

    return Object.values(combined);
  };

  const RiskItem: React.FC<{ data: any }> = ({ data }) => {
    return (
      <Card className="p-2 border-zinc-700">
        <CardHeader className="justify-between items-center flex-row">
          <div>
            <CardTitle>{formatAddress(data.address)}</CardTitle>
            <CardDescription className="mt-2">
              {data.risk?.hacking_event ? (
                <div>{data.risk.hacking_event}</div>
              ) : (
                <Badge variant="destructive">{data.risk?.risk_level}</Badge>
              )}
            </CardDescription>
          </div>
          <div className="font-mono">
            <SecurityScale value={data.risk?.score} />
          </div>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="mb-2">
            {data?.risk?.detail_list && data.risk.detail_list.length > 0 && (
              <h3 className="text-sm font-bold text-zinc-600 leading-none mb-2">
                Why
              </h3>
            )}
            {data?.risk?.detail_list.map((detail: string, index: number) => (
              <div
                key={index}
                className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-zinc-500" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {detail.toLowerCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div>
            {data?.risk?.risk_detail && data.risk.risk_detail.length > 0 && (
              <h3 className="text-sm font-bold text-zinc-600 leading-none mb-2">
                Where?
              </h3>
            )}

            {data?.risk?.risk_detail &&
              combineRiskDetails(data.risk.risk_detail).map(
                (detail: any, index: any) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-zinc-500" />
                    <div className="space-y-1">
                      <a
                        href={`https://etherscan.io/address/${detail.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        <p className="text-sm font-medium leading-none">
                          {detail.label} (
                          {detail.type
                            .split('_')
                            .map(
                              (word: string) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(' ')}
                          )
                        </p>
                      </a>
                      <p className="text-sm text-muted-foreground">
                        Vol: {formatNumber(detail.volume)}{' '}
                      </p>

                      {detail.percent > 0.1 && (
                        <div className="flex flex-row items-center">
                          <Progress
                            value={detail.percent}
                            className="w-[60%] mr-1"
                          />
                          <p className="text-xs">
                            {detail.percent < 1
                              ? `<1%`
                              : `${Number(detail.percent).toFixed(2)}%`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" asChild>
            <Link href={`https://etherscan.io/tx/${data.hash}`} target="_blank">
              <LinkIcon className="mr-2 h-4 w-4" /> TX:{' '}
              {formatAddress(data.hash)}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const update = (data: any) => {
    setLineData(prev =>
      prev
        .concat(
          data
            .filter((d: any) => d.type === 'honeypot' || d.type === 'risk')
            .map((d: any) => {
              if (d.type === 'honeypot') {
                // if (props.settings.honeypot)

                return <HoneypotItem key={nonce.current++} data={d.data} />;
              } else if (d.type === 'risk') {
                console.log('risk data', d);
                console.log('-- risk data', d.data.risk);
                return <RiskItem key={nonce.current++} data={d.data} />;
              }
            })
        )
        .slice(-50)
    );
  };

  useEffect(() => {
    if (lineData.length > lineDataLengthRef.current && viewRef.current) {
      viewRef.current.scrollTo(0, viewRef.current.scrollHeight);
    }
    lineDataLengthRef.current = lineData.length;
  }, [lineData]);

  useImperativeHandle(ref, () => ({
    update,
    clear: () => setLineData([]),
  }));

  return (
    <div
      className="flex flex-col w-full p-4 items-center h-[calc(100vh-217px)] overflow-y-auto"
      ref={viewRef}
    >
      <div className="space-y-5 w-full">{lineData}</div>
    </div>
  );
});

export default Anomaly;
