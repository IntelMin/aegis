import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatAddress } from '@/utils/format-address';

import React from 'react';

const UserPaymentsTable = () => {
  return (
    <div className="w-full overflow-x-auto mt-6">
      <Table className="p-3 mt-6 border border-zinc-800 w-full">
        <TableHeader className="grid grid-cols-4 bg-gray-800">
          {' '}
          {/* 3 columns grid */}
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Transaction Id
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            From Address
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            To Address
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Amount
          </TableHead>
        </TableHeader>

        <TableBody>
          <TableRow className="grid grid-cols-4 items-center border-b-1 ">
            {' '}
            <TableCell className="py-2 px-4 text-neutral-100 text-center">
              #7387653765739
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              {formatAddress('0xe6ue787669843i33939383737')}
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              {formatAddress('0xe6ue787669843i33939383737')}
            </TableCell>
            <TableCell className=" text-sky-500 py-2 px-4 text-center">
              2.223 ETH
            </TableCell>
          </TableRow>

          <TableRow className="grid grid-cols-4 items-center border-b-1 bg-[#0E0E0E]">
            {' '}
            <TableCell className="py-2 px-4 text-neutral-100 text-center">
              #7387658765654
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              {formatAddress('0xe6ue787669843i339393837987')}
            </TableCell>
            <TableCell className="py-2 px-4 text-neutral-200 text-center">
              {formatAddress('0xe6ue787669843i33939383983')}
            </TableCell>
            <TableCell className=" text-sky-500 py-2 px-4 text-center">
              1.334 ETH
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default UserPaymentsTable;
