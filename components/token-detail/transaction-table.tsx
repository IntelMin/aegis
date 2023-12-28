import React from "react";
import TableHead from "./table-head";
import {
  transactionTablHeadType,
  transactionTableType,
} from "./token-constant";

type Props = {
  transactionTableHead: transactionTablHeadType;
  transactionTable: transactionTableType;
};

const TransactionTable = ({
  transactionTableHead,
  transactionTable,
}: Props) => {
  return (
    <table className="w-full">
      <TableHead tableHead={transactionTableHead} />
      <tbody>
        {transactionTable?.map((item) => (
          <tr
            key={item?.id}
            className="w-full grid grid-cols-7 p-2 border-b border-zinc-800"
          >
            <td className="text-blue-300 text-[14px]">{item?.txnHash}</td>
            <td className="text-neutral-300 text-[14px]">{item?.age}</td>
            <td className="text-blue-200 text-[14px]">{item?.block}</td>
            <td className="text-neutral-400 text-[14px]">
              <span className="bg-zinc-800 px-[6px] py-1">{item?.method}</span>
            </td>
            <td className="text-blue-300 text-[14px]">{item?.from}</td>
            <td className="text-blue-300 text-[14px] -translate-x-3">
              <span className="bg-slate-800 mr-1 px-[6px] py-1">IN</span>
              {item?.to}
            </td>
            <td className="text-neutral-300 text-[14px]">{item?.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
