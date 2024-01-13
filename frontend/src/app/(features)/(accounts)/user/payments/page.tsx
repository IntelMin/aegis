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

const UserAccountTable = () => {
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
          <TableRow className="grid grid-cols-4 items-center border-b-1 ">
            {' '}
            <TableCell className="py-2 px-4 text-neutral-100 text-center">
              12/7/2024
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              Veteran
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              Ξ5
            </TableCell>
            <TableCell className="py-2 px-4 text-green-400 text-center">
              540
            </TableCell>
          </TableRow>

          <TableRow className="grid grid-cols-4 items-center border-b border-1 bg-[#0E0E0E]">
            {' '}
            <TableCell className="py-2 px-4 text-neutral-100 text-center">
              12/5/2024
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              Seasoned
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              Ξ1
            </TableCell>
            <TableCell className="py-2 px-4 text-green-400 text-center">
              230
            </TableCell>
          </TableRow>

          <TableRow className="grid grid-cols-4 items-center border-b-1 ">
            {' '}
            <TableCell className="py-2 px-4 text-neutral-100 text-center">
              12/1/2024
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              Basic
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              Ξ0.5
            </TableCell>
            <TableCell className="py-2 px-4 text-green-400 text-center">
              100
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default UserAccountTable;