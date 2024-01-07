import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import copy from 'copy-to-clipboard';
import Sparkline from './dashboard-sparkline';
import { formatAddress } from '@/utils/format-address';

type DashboardDataTableProps = {
  tableData: any[];
  setTableLimit: (value: number) => void;
  tableLimit: number;
};

const DashboardDataTable = ({
  tableData,
  setTableLimit,
  tableLimit,
}: DashboardDataTableProps) => {
  const columns = [
    { label: 'Name', colSpan: 2 },
    { label: 'Token', colSpan: 3 },
    { label: 'Price', colSpan: 1 },
    { label: 'Chart', colSpan: 2 },
    { label: 'M-CAP', colSpan: 2 },
    { label: 'Launched', colSpan: 2 },
    { label: 'LIQUIDITY', colSpan: 1 },
    { label: '30MIN', colSpan: 1 },
    { label: '1Hr', colSpan: 1 },
    { label: 'Audit', colSpan: 1 },
  ];

  const handleCopy = (data: string) => {
    copy(data);
  };

  function timeAgo(timeInSeconds: number): string {
    const currentTime = new Date();
    const time = new Date(timeInSeconds * 1000);
    const timeDifference = currentTime.getTime() - time.getTime(); // time in milliseconds
    const seconds = Math.floor(timeDifference / 1000);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} minutes ago`;
    } else if (seconds < 86400) {
      return `${Math.floor(seconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(seconds / 86400)} days ago`;
    }
  }
  if (!tableData) return null;
  return (
    <Table className="p-3 mt-6 border border-zinc-800">
      <TableHeader>
        {columns.map((column, index) => (
          <TableHead
            key={index}
            className={`text-left py-3 text-neutral-400 text-[11px] font-[500] uppercase`}
          >
            {column.label}
          </TableHead>
        ))}
      </TableHeader>
      <TableBody>
        {tableData?.map((item, index) => (
          <TableRow
            key={index}
            className={`${
              index % 2 === 0 ? 'bg-zinc-900' : ''
            } py-2 px-[3px] text-[14px] items-center border-none`}
          >
            {/* name */}
            <TableCell
              className={`text-neutral-100 break-words w-[150px] text-left`}
            >
              {item.name}
            </TableCell>

            {/* token */}
            <TableCell className={`text-neutral-200 col-span-3`}>
              <div className="flex items-center gap-[6px]">
                <Image
                  src={
                    item.imageSmallUrl
                      ? `/api/token/image?q=${item.imageSmallUrl
                          .split('/')
                          .pop()}`
                      : `/icons/token-default.svg`
                  }
                  alt={item.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <div className="flex flex-col p-0 m-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[13px] capitalize">{item.symbol}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-[13px] text-blue-400">
                      {formatAddress(item.address)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.address)}
                    >
                      <Image
                        src="/icons/copy.svg"
                        alt="copy"
                        width={12}
                        height={12}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </TableCell>

            {/* price */}
            <TableCell className={`text-neutral-300 col-span-1`}>
              {parseFloat(item.price).toFixed(6)}
            </TableCell>

            {/* chart */}
            <TableCell
              className={`text-neutral-200 col-span-2 z-[0] relative `}
            >
              <Sparkline data={item.sparkline} />
            </TableCell>

            {/* m-cap */}
            <TableCell className={`text-neutral-200 col-span-2`}>
              <div className="flex flex-col p-0 m-0">
                <p className="text-[13px] text-neutral-300">
                  {parseFloat(
                    parseFloat(item.marketCap).toFixed(2)
                  ).toLocaleString('en')}
                </p>
              </div>
            </TableCell>

            {/* launched */}
            <TableCell className={`text-blue-400 col-span-2`}>
              {timeAgo(item.createdAt)}
            </TableCell>

            {/* liquidity */}
            <TableCell className={`text-neutral-200 col-span-1`}>
              <div className="flex flex-col p-0 m-0">
                <p className="text-[13px] text-neutral-300">
                  {parseFloat(
                    parseFloat(item.volume).toFixed(2)
                  ).toLocaleString('en')}
                </p>
                <p className="text-[13px] text-neutral-500">
                  {parseFloat(
                    parseFloat(item.liquidity).toFixed(2)
                  ).toLocaleString('en')}
                </p>
              </div>
            </TableCell>

            {/* 30min */}
            <TableCell
              className={`${
                item.priceChange < 0 ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {item.priceChange.toFixed(2)} %
            </TableCell>

            {/* 1hr */}
            <TableCell
              className={`${
                item.priceChange1 < 0 ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {item.priceChange1.toFixed(2)} %
            </TableCell>

            {/* Audit */}
            <TableCell className={`text-green-400`}>
              <button className="bg-green-700 text-white pl-2 pr-2 pt-1 pb-1 rounded-[4px]">
                Audit
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DashboardDataTable;
