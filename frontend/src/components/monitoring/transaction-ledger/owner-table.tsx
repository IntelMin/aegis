import { formatAddress } from '@/utils/format-address';

import Image from 'next/image';
import React from 'react';
import SelectTopToken from '../select-top-token';
import TotalTransactionTable from './total-transaction-table';
import { tableHead, totalTransactionTableData } from '../token-constant';
import Link from 'next/link';
import { HoldersDemoData } from './demo-table-data';
import TableHead from '../table-head';

const OwnerTable = ({ selected }: any) => {
  return (
    <div className="h-[400px] overflow-auto">
      <div className="flex items-center justify-between mb-2 ">
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
      <table className="w-full">
        <div className="sticky top-0">
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
        </div>
        <tbody>
          {HoldersDemoData?.map(item => (
            <tr
              key={item?.rank}
              className="grid w-full grid-cols-6 p-2 border-b border-zinc-800"
            >
              <td className="flex items-center col-span-1">
                <p className="text-neutral-300 text-[14px]">
                  OSMO/<span className="text-gray-500">MATIC</span>
                </p>
              </td>
              <td className="flex items-center col-span-1">
                <p className={`text-blue-400 text-[14px]`}>{item.address}</p>
              </td>
              <td className="flex items-center col-span-1">
                <p className={`text-white text-[14px]`}>860,459,098</p>
              </td>
              <td className="flex items-center col-span-1">
                <p className="text-[14px] text-white">$ 2.23</p>
              </td>
              <td className="flex items-center col-span-1 gap-2">
                <Image
                  src="/token-icons/token-table.svg"
                  alt="icon"
                  width={14}
                  height={14}
                />{' '}
                <span className="text-white text-[14px]">Binance</span>
              </td>
              <td className="col-span-1">
                <p className="text-gray-500 text-[12px] break-all">
                  0x11541867A0dB7445bDd4Ad32Fc7B5207aCbd58b0 amount%: 3 amount:
                  30,000,000.0
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerTable;
