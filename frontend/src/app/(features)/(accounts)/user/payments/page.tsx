'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

import React from 'react';
import { BiPackage, BiPencil, BiPurchaseTag } from 'react-icons/bi';

type paymenthisttype = {
  type: string;
  created_at: Date;
  amount_eth: number;
  credits: number;
  id: number;
  user_id: number;
  package: string;
  hash: string;
};
const UserAccountTable = () => {
  const [paymenthist, setPaymenthist] = React.useState([]);
  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/credit/history/credit');
      const json = await res.json();
      console.log(json);
      setPaymenthist(json.txn);
    }
    fetchData();
  }, []);
  console.log(paymenthist);
  if (paymenthist.length === 0) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex flex-col pb-8">
          <h1 className="text-lg font-semibold">Your payments</h1>
        </div>
        <div className="flex flex-col">
          <p className="text-md text-zinc-500">No payments yet</p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-row pb-8 justify-between">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Your payments</h1>
          <p className="text-md text-zinc-500">Credit purchases made</p>
        </div>
        <div className="flex flex-col">
          <Link href="/payment">
            <Button>
              <BiPackage className="w-4 h-4 mr-2" />
              Purchase Credits
            </Button>
          </Link>
        </div>
      </div>
      <Table className="p-3 border border-zinc-800 w-full">
        <TableHeader className="grid grid-cols-4 bg-zinc-800">
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Date
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Package
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Price (ETH)
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Credits
          </TableHead>
        </TableHeader>
        <TableBody>
          {paymenthist.map((item: paymenthisttype, index: number) => (
            <TableRow
              className="grid grid-cols-4 items-center border-b-1 "
              key={index}
            >
              {' '}
              <TableCell className="py-2 px-4 text-neutral-100 text-center">
                {new Date(item.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="py-2 px-4 text-neutral-200 text-center">
                {item.package}
              </TableCell>
              <TableCell className="py-2 px-4 text-neutral-200 text-center">
                <a href={'https://etherscan.io/tx/' + item.hash}>
                  Ξ{item.amount_eth}
                </a>
              </TableCell>
              <TableCell className="py-2 px-4 text-green-400 text-center">
                {item.credits}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserAccountTable;
