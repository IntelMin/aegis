import { formatAddress } from '@/utils/format-address';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
// import SelectTopToken from '../select-top-token';
import TotalTransactionTable from './total-transaction-table';
import { tableHead, totalTransactionTableData } from '../token-constant';
import Link from 'next/link';
import { HoldersDemoData } from './demo-table-data';
import TableHead from '../table-head';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const TradersTable = ({ selected }: any) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Made this timeout to show the skeleton loading will remove when api is ready
      setTimeout(() => setIsLoading(false), 1000);
    };

    loadData();
  }, []);

  return (
    <div className="h-[400px] overflow-auto">
      <div className="flex max-md:flex-col max-md:gap-3 md:items-center justify-between mb-2 ">
        <div className="flex gap-2">
          <h1 className="text-white">OSMO</h1>
          <h1 className="text-gray-500">{selected}</h1>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <Image src="/icons/network.svg" alt="icon" width={14} height={14} />
            <p className="text-blue-500 text-[14px]">
              {formatAddress('0xelj45d3e454u4i4u484y64dt3')}
            </p>
          </div>
          {/* <SelectTopToken /> */}
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="w-full h-96" />
      ) : (
        <Table className="w-full">
          {/* <div className="sticky top-0"> */}
          <TableHead
            tableHead={[
              '',
              'Address',
              'Amount($)',
              'Price',
              'Exchange',
              'Time',
            ]}
          />
          {/* </div> */}
          <TableBody>
            {HoldersDemoData?.map(item => (
              <TableRow
                key={item?.rank}
                className="w-full p-2 border-b border-zinc-800"
              >
                <TableCell className="">
                  <p className="text-neutral-300 text-[14px]">
                    OSMO/<span className="text-gray-500">MATIC</span>
                  </p>
                </TableCell>
                <TableCell className="">
                  <p className={`text-blue-400 text-[14px]`}>{item.address}</p>
                </TableCell>
                <TableCell className="">
                  <p className={`text-white text-[14px]`}>860,459,098</p>
                </TableCell>
                <TableCell className="min-w-[90px]">
                  <p className="text-[14px] text-white">$ 2.23</p>
                </TableCell>
                <TableCell className="flex items-center  gap-2">
                  <Image
                    src="/token-icons/token-table.svg"
                    alt="icon"
                    width={14}
                    height={14}
                  />{' '}
                  <span className="text-white text-[14px]">Binance</span>
                </TableCell>
                <TableCell className="">
                  <p className="text-white">12min</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TradersTable;
