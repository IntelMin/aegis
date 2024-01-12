import React from 'react';
import { TableHead, TableHeader } from '../ui/table';

type Props = {
  tableHead: string[];
};

const TableHeads = ({ tableHead }: Props) => {
  return (
    <TableHeader className={` bg-neutral-900 p-2`}>
      {tableHead?.map(item => (
        <TableHead
          key={item}
          className={`col-span-1 text-neutral-500 text-[14px] font-[500] text-left`}
        >
          {item}
        </TableHead>
      ))}
    </TableHeader>
  );
};

export default TableHeads;
