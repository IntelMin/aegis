import React from "react";

type Props = {
  tableHead: string[];
};

const TableHead = ({ tableHead }: Props) => {
  return (
    <th className="w-full grid grid-cols-4">
      <tr className={`col-span-4 grid grid-cols-${tableHead.length} bg-neutral-900 p-2`}>
        {tableHead?.map((item) => (
          <td
            key={item}
            className={`col-span-1 text-neutral-500 text-[14px] font-[500] text-left`}
          >
            {item}
          </td>
        ))}
      </tr>
    </th>
  );
};

export default TableHead;
