import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import TableHead from './table-head';

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
  return (
    <table className="w-full">
      <TableHead tableHead={tableHead} />
      <tbody>
        {transactionTableData?.map(item => (
          <tr
            key={item?.id}
            className="grid w-full grid-cols-4 p-2 border-b border-zinc-800"
          >
            <td className="col-span-1">
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
            </td>
            <td className="col-span-1">
              <p className="text-neutral-300 text-[14px]">{item?.balance}</p>
            </td>
            <td className="col-span-1">
              <p className={`text-green-400 text-[14px]`}>${item?.value}</p>
            </td>
            <td className="col-span-1">
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TotalTransactionTable;
