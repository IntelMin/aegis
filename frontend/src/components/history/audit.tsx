import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { TableBody, TableCell, TableRow } from '../ui/table';
import { formatDate } from '@/utils/format-date';
import { formatTime } from '@/utils/format-time';
import { FaEye } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

type Props = {
  data: Number[];
  type?: string;
  code?: boolean;
};

export const AuditTableBody = ({ data, code, type }: Props) => {
  const router = useRouter();
  return (
    <TableBody>
      {data.map((item, index: number) => (
        <TableRow
          className="items-center bg-zinc-900 border-b border-zinc-800 "
          key={index}
        >
          {' '}
          {!code && (
            <TableCell className="py-4 px-4 flex items-center justify-center gap-2 text-center">
              <Image
                src="/icons/token-default.svg"
                alt="token-svg"
                width={24}
                height={24}
              />
              <p className="text-zinc-100 text-[12px] font-[400]">$AAVE</p>
            </TableCell>
          )}
          <TableCell className="py-2 px-4 text-neutral-100 text-center min-w-[180px]">
            {/* {formatDate(item.created_at) + ' ' + formatTime(item.created_at)} */}
            <span>22-01-24</span> <span>8:46 AM</span>
          </TableCell>
          <TableCell className="py-3 px-4 text-center">
            <Button
              onClick={() => {
                if (code) router.push(`/audit/code`);
                else router.push(`/audit/token/1212/${type}`); // 1212 => address
              }}
              className="py-1 h-[30px] px-2 text-[12px] text-blue-400"
              style={{
                background: `rgba(96, 165, 250, 0.10)`,
              }}
            >
              <FaEye className="text-blue-400 text-[12px] mr-1" />
              <p className="text-blue-400 text-[12px] ml-1">View</p>
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
