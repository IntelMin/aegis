'use client';

import React, {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from 'react';
import { CubeAscii } from 'cube-ascii-react';
import { formatAge } from '@/utils/format-age';
import { WatchdogSettings } from '@/app/(features)/(free)/watchdog/page';

interface BlockStatusProps {
  settings: WatchdogSettings;
}

const BlockStatus = React.forwardRef(function BlockStatusComponent(
  props: BlockStatusProps,
  ref
) {
  const divRef = React.useRef<HTMLDivElement>(null);
  const preTagRef = React.useRef<HTMLPreElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = props;

  const [blockCount, setBlockCount] = useState(0);
  const [blockTxns, setBlockTxns] = useState(0);
  const [blockAddresses, setBlockAddresses] = useState(0);
  const [blockContracts, setBlockContracts] = useState(0);
  const [lastBlock, setLastBlock] = useState(0);
  const [updatedOn, setUpdatedOn] = useState('');

  useEffect(() => {
    if (divRef.current) {
      setIsLoaded(true);
    }
  }, [divRef]);

  useLayoutEffect(() => {
    if (!settings?.active) {
      setBlockCount(0);
      setBlockTxns(0);
      setBlockAddresses(0);
      setLastBlock(0);
      setUpdatedOn('');
    }
  }, [settings]);

  const padWithSpaces = (str: string, length: number) => {
    return str.padStart(length, ' ');
  };

  const updateBlock = (data: any) => {
    console.log('Updating block');

    if (data.number !== lastBlock) {
      setBlockCount(prevCount => prevCount + 1);
      setLastBlock(data.number);
    }
    setUpdatedOn(formatAge(parseInt(data.timestamp) * 1000, true));
    setBlockTxns(prevTxns => prevTxns + data.transactions);
    setBlockAddresses(prevAddresses => prevAddresses + data.addresses);
    setBlockContracts(prevContracts => prevContracts + data.contracts);
  };

  const updateAddress = () => {
    setBlockAddresses(prevAddresses => prevAddresses + 1);
  };

  useImperativeHandle(ref, () => ({
    updateBlock,
    updateAddress,
  }));

  return (
    <div className="flex flex-col bg-[#131313] w-full p-4 items-center h-full">
      <div ref={divRef} className="min-h-[140px] w-full pl-8">
        {isLoaded && blockCount !== 0 ? (
          <>
            <CubeAscii
              parentRef={divRef}
              useColor={false}
              preTagRef={preTagRef}
              frameRate={24}
            />
          </>
        ) : (
          <></>
        )}
      </div>

      <div className="font-thin text-sm text-zinc-600 w-full justify-center mt-5">
        <pre className="mb-6 whitespace-pre-wrap break-all">
          {`token      ${settings.token ? 'on' : 'off'}\n`}
          {`honeypot   ${settings.token ? 'on' : 'off'}\n`}
          {settings.address
            .map((addr, key) => `address    on\n${addr.toLowerCase()}`)
            .join('\n')}
        </pre>
        <pre>
          {!settings.active ? (
            'watchdog not started'
          ) : isLoaded && blockCount > 0 ? (
            <>
              {'Watching...\n\n'}
              {'BLOCK:          '}
              <span className="text-zinc-500">
                {padWithSpaces(blockCount.toString(), 7)}
              </span>
              {'\n'}
              {'TXNS:           '}
              <span className="text-zinc-500">
                {padWithSpaces(blockTxns.toString(), 7)}
              </span>
              {'\n'}
              {'ADDRESSES:      '}
              <span className="text-zinc-500">
                {padWithSpaces(blockAddresses.toString(), 7)}
              </span>
              {'\n'}
              {'CONTRACTS:      '}
              <span className="text-zinc-500">
                {padWithSpaces(blockContracts.toString(), 7)}
              </span>
              {'\n\n'}
              {'BLOCK #:       '}
              <span className="text-zinc-500">
                {padWithSpaces(lastBlock.toString(), 7)}
              </span>
              {'\n\n'}
              {'UPDATED:        '}
              <span className="text-zinc-500">
                {padWithSpaces(updatedOn.toString(), 3)} ago
              </span>
              {'\n'}
            </>
          ) : (
            'Waiting...'
          )}
        </pre>
      </div>
    </div>
  );
});

export default BlockStatus;
