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
import { formatDate } from '@/utils/format-date';
import Image from 'next/image';
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
          <p className="text-md text-zinc-400">Previous credit purchases</p>
        </div>
        <div className="flex flex-col">
          <Link href="/payment">
            <Button
              variant="blue"
              className="text-[16px] flex items-center gap-2"
            >
              <Image
                src="/icons/purchase.svg"
                alt="purchase-svg"
                width={24}
                height={24}
                style={{
                  filter: 'invert(100%) brightness(1000%) contrast(100%)',
                }}
              />
              Purchase Credits
            </Button>
          </Link>
        </div>
      </div>
      <Table className="p-3 border border-zinc-800 w-full">
        <TableHeader>
          <TableHead className="py-5 px-4 text-zinc-400 text-[12px] font-[500] uppercase text-center">
            Package
          </TableHead>
          <TableHead className="py-3 px-4 text-zinc-400 text-[12px] font-[500] uppercase text-center">
            Price (ETH)
          </TableHead>
          <TableHead className="py-3 px-4 text-zinc-400 text-[12px] font-[500] uppercase text-center">
            Date
          </TableHead>
          <TableHead className="py-3 px-4 text-zinc-400 text-[12px] font-[500] uppercase text-center">
            Credits
          </TableHead>
        </TableHeader>
        <TableBody>
          {paymenthist.map((item: paymenthisttype, index: number) => (
            <TableRow
              className="items-center border-b border-zinc-800 bg-zinc-900"
              key={index}
            >
              {' '}
              <TableCell className="py-4 px-4 text-zinc-100 text-center font-[500] capitalize">
                {item.package}
              </TableCell>
              <TableCell className="py-2 px-4 text-zinc-100 font-[500] text-center">
                <a href={'https://etherscan.io/tx/' + item.hash}>
                  {item.amount_eth} ETH
                </a>
              </TableCell>
              <TableCell className="py-2 px-4 text-zinc-100 font-[500] text-center">
                {formatDate(item.created_at)}
              </TableCell>
              <TableCell className="py-2 px-4 text-blue-500 font-[500] text-center">
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
