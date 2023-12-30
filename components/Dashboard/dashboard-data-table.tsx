import React from "react";
import TableHead from "./table-head";
import TableRow from "./table-row";

type DashboardDataTableProps = {
  tableData: any[];
  setTableLimit: (value: number) => void;
  tableLimit: number;
};

const DashboardDataTable = ({ tableData, setTableLimit, tableLimit }: DashboardDataTableProps) => {
  return (
    <>
      <div className="mt-6 border border-zinc-800 p-3">
        <table className="w-full">
          <TableHead />
          {tableData?.map((item, i) => (
            <TableRow key={i} item={item} index={i} />
          ))}
        </table>
      </div>
      <div className="flex justify-center mt-2">
        {tableData.length !== 0 && (
          <button onClick={()=>setTableLimit(tableLimit + 10)} className="text-white bg-zinc-900 p-2 rounded-[4px] mt-2 text-[12px]">
            Show More
          </button>
        )}
      </div>
    </>
  );
};

export default DashboardDataTable;
