import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { TableBody, TableCell, TableRow } from '../ui/table';
import { formatDate } from '@/utils/format-date';
import { formatTime } from '@/utils/format-time';

type Historytype = {
  type: string;
  created_at: Date;

  id: number;
  user_id: number;
  cost: number;
};

type Props = {
  data: Historytype[];
};

export const ReportTableBody = ({ data }: Props) => {
  if (data.length === 0)
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <Image
          src="/icons/no-data.svg"
          alt="no-report-icon"
          width={100}
          height={100}
        />
        <p className="text-zinc-100 text-[12px] font-[400] mt-3">
          No reports generated yet
        </p>
      </div>
    );
  return (
    <TableBody>
      {data.map((item, index: number) => (
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
            {formatDate(item.created_at) + ' ' + formatTime(item.created_at)}
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
  );
};
