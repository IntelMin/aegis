import React, { useEffect, useState } from 'react';
import { formatAddress } from '@/utils/format-address';
import Image from 'next/image';
import { HoldersDemoData } from './demo-table-data';
import TableHead from '../table-head';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const HoldersTable = ({ selected }: any) => {
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
      <div className="flex max-md:flex-col max-md:gap-2 max-md:mb-4 md:items-center justify-between mb-2 ">
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
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="w-full h-36" />
      ) : (
        <Table className="w-full">
          {/* <div className="sticky top-0"> */}
          <TableHead
            tableHead={[
              'Rank',
              'Address',
              'Value($)',
              'Change 1D',
              'Change 7D',
            ]}
          />
          {/* </div> */}

          <TableBody>
            {HoldersDemoData?.map(item => (
              <TableRow
                key={item?.rank}
                className="w-full  p-2 border-b border-zinc-800"
              >
                <TableCell className="col-span-1">
                  <p className="text-neutral-300 text-[14px]">#{item?.rank}</p>
                </TableCell>
                <TableCell className="col-span-1">
                  <p className={`text-blue-400 text-[14px]`}>{item.address}</p>
                </TableCell>
                <TableCell className="col-span-1">
                  <p className={`text-white text-[14px]`}>{item.value_usd}</p>
                </TableCell>
                <TableCell className="col-span-1 min-w-[120px]">
                  <p
                    className={`${
                      item.change_1d.startsWith('+')
                        ? 'text-green-400'
                        : 'text-red-400'
                    } text-[14px]`}
                  >
                    {item.change_1d}
                  </p>
                </TableCell>
                <TableCell className="col-span-1 min-w-[120px]">
                  <p
                    className={`${
                      item.change_7d.startsWith('+')
                        ? 'text-green-400'
                        : 'text-red-400'
                    } text-[14px]`}
                  >
                    {item.change_7d}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default HoldersTable;
