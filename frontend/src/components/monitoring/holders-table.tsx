import { formatAddress } from '@/utils/format-address';

import Image from 'next/image';
import React from 'react';
import SelectTopToken from './select-top-token';
import TotalTransactionTable from './total-transaction-table';
import { tableHead, totalTransactionTableData } from './token-constant';
import Link from 'next/link';
import { HoldersDemoData } from './demo-table-data';
import TableHead from './table-head';

const HoldersTable = ({ selected }: any) => {
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
          <SelectTopToken />
        </div>
      </div>
      <table className="w-full">
        <div className="sticky top-0">
          <TableHead
            tableHead={[
              'Rank',
              'Address',
              'Value($)',
              'Change 1D',
              'Change 7D',
            ]}
          />
        </div>
        <tbody>
          {HoldersDemoData?.map(item => (
            <tr
              key={item?.rank}
              className="grid w-full grid-cols-5 p-2 border-b border-zinc-800"
            >
              <td className="col-span-1">
                <p className="text-neutral-300 text-[14px]">#{item?.rank}</p>
              </td>
              <td className="col-span-1">
                <p className={`text-blue-400 text-[14px]`}>{item.address}</p>
              </td>
              <td className="col-span-1">
                <p className={`text-white text-[14px]`}>{item.value_usd}</p>
              </td>
              <td className="col-span-1">
                <p
                  className={`${
                    item.change_1d.startsWith('+')
                      ? 'text-green-400'
                      : 'text-red-400'
                  } text-[14px]`}
                >
                  {item.change_1d}
                </p>
              </td>
              <td className="col-span-1">
                <p
                  className={`${
                    item.change_7d.startsWith('+')
                      ? 'text-green-400'
                      : 'text-red-400'
                  } text-[14px]`}
                >
                  {item.change_7d}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldersTable;
