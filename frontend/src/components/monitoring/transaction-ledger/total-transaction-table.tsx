import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import TableHead from '../table-head';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

type Props = {
  tableHead: string[];
  transactionTableData: {
    id: number;
    wallet: {
      name: string;
      tokenIconUrl: string;
    };
    balance: string;
    value: string;
    scan: {
      network: string;
      url: string;
    };
  }[];
};

const TotalTransactionTable = ({ tableHead, transactionTableData }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Made this timeout to show the skeleton loading will remove when api is ready
      setTimeout(() => setIsLoading(false), 1000);
    };

    loadData();
  }, []);

  if (isLoading) {
    return <Skeleton className="w-full h-36" />;
  }
  return (
    <Table className="w-full">
      <TableHead tableHead={tableHead} />
      <TableBody>
        {transactionTableData?.map(item => (
          <TableRow key={item?.id} className="p-2 border-b border-zinc-800">
            <TableCell className="col-span-1">
              <div className="flex items-center gap-2">
                <Image
                  src={item?.wallet?.tokenIconUrl}
                  alt="token-icon"
                  width={14}
                  height={14}
                />
                <p className="text-[16px] text-neutral-300 ">
                  {item?.wallet?.name}
                </p>
              </div>
            </TableCell>
            <TableCell className="col-span-1">
              <p className="text-neutral-300 text-[14px]">{item?.balance}</p>
            </TableCell>
            <TableCell className="col-span-1">
              <p className={`text-green-400 text-[14px]`}>${item?.value}</p>
            </TableCell>
            <TableCell className="col-span-1">
              <Link
                href={item?.scan?.url}
                className="flex items-center gap-2 text-blue-300 text-[12px]"
              >
                {item?.scan?.network}
                <Image
                  src="/icons/link.svg"
                  alt="link"
                  width={14}
                  height={14}
                />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TotalTransactionTable;
