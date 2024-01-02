import React from "react";
import TableHead from "@/components/dashboard/table-head";
import TableRow from "@/components/dashboard/table-row"

type DashboardDataTableProps = {
  tableData: any[];
  setTableLimit: (value: number) => void;
  tableLimit: number;
};

const DashboardDataTable = ({ tableData, setTableLimit, tableLimit }: DashboardDataTableProps) => {
  return (
    <>
      <div className="p-3 mt-6 border border-zinc-800">
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