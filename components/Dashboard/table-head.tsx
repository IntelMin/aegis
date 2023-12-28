import React from "react";

const TableHead = () => {
  const columns = [
    { label: "Time", colSpan: 1 },
    { label: "Token", colSpan: 3 },
    { label: "Tax", colSpan: 1 },
    { label: "Price", colSpan: 1 },
    { label: "Chart", colSpan: 2 },
    { label: "M-CAP", colSpan: 2 },
    { label: "MAX-BUY", colSpan: 1 },
    { label: "LIQUIDITY", colSpan: 2 },
    { label: "30MIN", colSpan: 1 },
    { label: "1Hr", colSpan: 1 },
    { label: "4hr", colSpan: 1 },
  ];

  return (
    <tr className="grid grid-cols-16">
      {columns.map((column, index) => (
        <th key={index} className={`text-left py-3 text-neutral-400 text-[11px] font-[500] col-span-${column.colSpan} uppercase`}>
          {column.label}
        </th>
      ))}
    </tr>
  );
};

export default TableHead;
