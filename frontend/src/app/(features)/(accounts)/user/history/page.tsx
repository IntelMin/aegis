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

import React from 'react';
import { BiPencil } from 'react-icons/bi';

const UserAccountTable = () => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col pb-8">
        <h1 className="text-lg font-semibold">Your history</h1>
        <p className="text-md text-zinc-500">Items you have unlocked</p>
      </div>
      <Table className="p-3 border border-zinc-800 w-full">
        <TableHeader className="grid grid-cols-3 bg-zinc-800">
          {' '}
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Date
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Type
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Details
          </TableHead>
        </TableHeader>
        <TableBody>
          <TableRow className="grid grid-cols-3 items-center border-b-1 ">
            {' '}
            <TableCell className="py-2 px-4 text-neutral-100 text-center">
              Yuvraj Jwala
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              yuvrajjwala@gmail.com
            </TableCell>
          </TableRow>

          <TableRow className="grid grid-cols-3 items-center border-b border-1 bg-[#0E0E0E]">
            {' '}
            <TableCell className="py-2 px-4 text-neutral-100 text-center">
              Kyono Suke
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              Kyono@gmail.com
            </TableCell>
            <TableCell className="py-2 px-4 text-green-400 text-center"></TableCell>
          </TableRow>

          <TableRow className="grid grid-cols-3 items-center border-b-1 ">
            {' '}
            <TableCell className="py-2 px-4 text-neutral-100 text-center">
              Aslam Mod.
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              aslam@gmail.com
            </TableCell>
            <TableCell className="py-2 px-4 text-green-400 text-center"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default UserAccountTable;
