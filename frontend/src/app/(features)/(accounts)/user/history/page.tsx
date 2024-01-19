'use client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/utils/format-date';
import { formatTime } from '@/utils/format-time';
import Image from 'next/image';

import React, { useEffect } from 'react';
import { BiPencil } from 'react-icons/bi';
type Historytype = {
  type: string;
  created_at: Date;

  id: number;
  user_id: number;
  cost: number;
};

type typeconfig = {
  [key: string]: string;
  detailed: string;
  code: string;
  report: string;
  quick: string;
};
const UserAccountTable = () => {
  const [history, setHistory] = React.useState([]);
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/credit/history/txn');
      const json = await res.json();
      console.log(json);

      setHistory(json.txn);
    }
    fetchData();
  }, []);

  if (history.length === 0) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex flex-col pb-8">
          <h1 className="text-lg font-semibold">Your history</h1>
        </div>
        <div className="flex flex-col">
          <p className="text-md text-zinc-500">No history yet</p>
        </div>
      </div>
    );
  }
  const Typeconfig: typeconfig = {
    detailed: 'Detailed audit',
    code: 'Code audit',
    report: 'Report generation',
    quick: 'Quick audit',
  };
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col pb-8">
        <h1 className="text-lg font-semibold">Your Audits</h1>
        <p className="text-md text-zinc-500">Items you have unlocked</p>
      </div>
      <Table className="p-3 border border-zinc-800 w-full">
        <TableHeader className="">
          <TableHead className="py-4 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            TOKEN
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Date
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            FILE
          </TableHead>
        </TableHeader>
        <TableBody>
          {history.map((item: Historytype, index: number) => (
            <TableRow
              className="items-center bg-zinc-900 border-b border-zinc-800 "
              key={index}
            >
              {' '}
              <TableCell className="py-4 px-4 flex items-center justify-center gap-2 text-center">
                <Image
                  src="/icons/token-default.svg"
                  alt="token-svg"
                  width={24}
                  height={24}
                />
                <p className="text-zinc-100 text-[12px] font-[400]">$AAVE</p>
              </TableCell>
              <TableCell className="py-2 px-4 text-neutral-100 text-center min-w-[180px]">
                {formatDate(item.created_at) +
                  ' ' +
                  formatTime(item.created_at)}
              </TableCell>
              <TableCell className="py-3 px-4 text-center">
                <Button
                  className="py-1 h-[30px] px-2 text-[12px] text-blue-400"
                  style={{
                    background: `rgba(96, 165, 250, 0.10)`,
                  }}
                >
                  <Image
                    src="/icons/download-report.svg"
                    alt="download-icon"
                    width={16}
                    height={16}
                  />
                  <p className="text-blue-400 text-[12px] ml-1">Download</p>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserAccountTable;
