'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
        <h1 className="text-lg font-semibold">Your history</h1>
        <p className="text-md text-zinc-500">Items you have unlocked</p>
      </div>
      <Table className="p-3 border border-zinc-800 w-full">
        <TableHeader className="grid grid-cols-3 bg-zinc-800">
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Cost (Credits)
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Type
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Date
          </TableHead>
        </TableHeader>
        <TableBody>
          {history.map((item: Historytype, index: number) => (
            <TableRow
              className="grid grid-cols-3 items-center border-b-1 "
              key={index}
            >
              {' '}
              <TableCell className="py-2 px-4 text-red-400 text-center">
                {item.cost}
              </TableCell>
              <TableCell className="py-2 px-4 text-neutral-200 text-center">
                {Typeconfig[item.type]}
              </TableCell>
              <TableCell className="py-2 px-4 text-neutral-100 text-center">
                {new Date(item.created_at).toLocaleDateString() +
                  ' ' +
                  new Date(item.created_at).toLocaleTimeString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserAccountTable;
