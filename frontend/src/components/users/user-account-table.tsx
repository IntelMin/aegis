import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import React from 'react';

const UserAccountTable = () => {
  return (
    <div className="w-full overflow-x-auto mt-6">
      <Table className="p-3 mt-6 border border-zinc-800 w-full">
        <TableHeader className="grid grid-cols-3 bg-gray-800">
          {' '}
          {/* 3 columns grid */}
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            User Name
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            User Email
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            User Type
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
            <TableCell className="py-2 px-4 text-center">User</TableCell>
          </TableRow>

          <TableRow className="grid grid-cols-3 items-center border-b border-1 bg-[#0E0E0E]">
            {' '}
            <TableCell className="py-2 px-4 text-neutral-100 text-center">
              Kyono Suke
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              Kyono@gmail.com
            </TableCell>
            <TableCell className="py-2 px-4 text-green-400 text-center">
              Admin
            </TableCell>
          </TableRow>

          <TableRow className="grid grid-cols-3 items-center border-b-1 ">
            {' '}
            <TableCell className="py-2 px-4 text-neutral-100 text-center">
              Aslam Mod.
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              aslam@gmail.com
            </TableCell>
            <TableCell className="py-2 px-4 text-center">User</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default UserAccountTable;
