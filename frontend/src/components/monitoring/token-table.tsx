'use client';

import Image from 'next/image';
import React from 'react';
import TotalTransactionTable from './total-transaction-table';
import TableHead from './table-head';
import {
  btnOption,
  tableHead,
  totalTransactionTableData,
  transactionTable,
  transactionTableHead,
} from './token-constant';
import LiquidityReport from './liquidity-report';
import HoldersTable from './holders-table';
import TradersTable from './traders-table';
import OwnerTable from './owner-table';

type Props = {};

const TokenDetailTable = (props: Props) => {
  const [selected, setSelected] = React.useState('TotalTransaction');
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {btnOption?.map(item => (
          <button
            key={item?.text}
            onClick={() => setSelected(item?.value)}
            className={`px-3 py-2 ${
              selected === item?.value ? 'bg-blue-600' : 'bg-neutral-900'
            } text-neutral-100 text-[16px] leading-[20px] font-[400] hover:bg-blue-600 transition-all ease-in duration-150`}
          >
            {item?.text}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4 p-3 border border-zinc-800">
        {(selected === 'TotalTransaction' || selected === 'Transactions') && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-[16px] text-neutral-300 font-[400]">
                  OSMO
                </h1>
                <h1 className="text-[16px] text-neutral-500 font-[400]">
                  {selected}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/network.svg"
                  alt="icon"
                  width={14}
                  height={14}
                />
                <p className="text-blue-500 text-[14px]">0x34e...45rty</p>
              </div>
            </div>
            {selected === 'TotalTransaction' ? (
              <TotalTransactionTable
                tableHead={tableHead}
                transactionTableData={totalTransactionTableData}
              />
            ) : (
              <table className="w-full">
                <TableHead tableHead={transactionTableHead} />
                <tbody>
                  {transactionTable?.map(item => (
                    <tr
                      key={item?.id}
                      className="grid w-full grid-cols-7 p-2 border-b border-zinc-800"
                    >
                      <td className="text-blue-300 text-[14px]">
                        {item?.txnHash}
                      </td>
                      <td className="text-neutral-300 text-[14px]">
                        {item?.age}
                      </td>
                      <td className="text-blue-200 text-[14px]">
                        {item?.block}
                      </td>
                      <td className="text-neutral-400 text-[14px]">
                        <span className="bg-zinc-800 px-[6px] py-1">
                          {item?.method}
                        </span>
                      </td>
                      <td className="text-blue-300 text-[14px]">
                        {item?.from}
                      </td>
                      <td className="text-blue-300 text-[14px] -translate-x-3">
                        <span className="bg-slate-800 mr-1 px-[6px] py-1">
                          IN
                        </span>
                        {item?.to}
                      </td>
                      <td className="text-neutral-300 text-[14px]">
                        {item?.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {selected === 'LiquidityReport' && (
          <LiquidityReport selected={selected} />
        )}

        {selected === 'Holders' && <HoldersTable selected={selected} />}

        {selected === 'Trades' && <TradersTable selected={selected} />}

        {selected === 'Owner' && <OwnerTable selected={selected} />}
      </div>
    </div>
  );
};

export default TokenDetailTable;
