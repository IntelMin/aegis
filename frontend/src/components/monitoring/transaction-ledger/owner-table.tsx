import { formatAddress } from '@/utils/format-address';

import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import TableHead from '../table-head';
import { HoldersDemoData } from './demo-table-data';

const OwnerTable = ({ selected }: any) => {
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
      <div className="hidden md:flex items-center justify-between mb-2 ">
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
        <Skeleton className="w-full h-96" />
      ) : (
        <Table className="w-full">
          {/* <div className="sticky top-0"> */}
          <TableHead
            tableHead={[
              'Time',
              'Wallet',
              'Event type',
              'Txn',
              'Signature',
              'Description',
            ]}
          />
          {/* </div> */}
          <TableBody>
            {HoldersDemoData?.map(item => (
              <TableRow key={item?.rank}>
                <TableCell className="font-medium">
                  <p className="text-neutral-300 text-[14px]">
                    OSMO/<span className="text-gray-500">MATIC</span>
                  </p>
                </TableCell>
                <TableCell>
                  <p className={`text-blue-400 text-[14px]`}>{item.address}</p>
                </TableCell>
                <TableCell className="min-w-[150px]">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/token/binance.svg"
                      alt="icon"
                      width={14}
                      height={14}
                    />{' '}
                    <span className="text-white text-[14px]">Binance</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="w-[200px">
                    <p className="text-blue-400 text-[12px] break-all">TXN</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">Transfer</TableCell>
                <TableCell>
                  <div className="flex-col flex gap-2 items-start">
                    <p className="text-sm text-neutral-400">Transfer: from:</p>
                    <p className="text-sm text-neutral-400">
                      0x46h56u65C41E481Cb5a37868267E15eB87
                    </p>
                    <p className="text-sm text-neutral-400">F11b65247 to:</p>
                    <p className="text-sm text-neutral-400">
                      0x11541867A0dB7445bDd4Ad32Fc7B5207aCbd58b0 amount%: 3
                    </p>
                    <p className="text-sm text-neutral-400">
                      amount: 30,000,000.0
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default OwnerTable;
