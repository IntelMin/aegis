'use client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import { formatDate } from '@/utils/format-date';
import { formatTime } from '@/utils/format-time';
import Image from 'next/image';

import React, { useEffect } from 'react';
import { BiChevronDown, BiPencil } from 'react-icons/bi';
import { SelectTrigger } from '@radix-ui/react-select';
import { ReportTableBody } from '@/components/history/report';
import { AuditTableBody } from '@/components/history/audit';

type typeconfig = {
  [key: string]: string;
  detailed: string;
  code: string;
  report: string;
  quick: string;
};
const UserAccountTable = () => {
  const [history, setHistory] = React.useState([]);
  const [type, setType] = React.useState('Reports');

  const reportsTableHead = ['TOKEN', 'DATE', 'FILE'];
  const auditTableHead = ['TOKEN', 'DATE', 'VIEW'];
  const codeAuditTableHead = ['DATE', 'VIEW'];

  const [tableHead, setTableHead] = React.useState(reportsTableHead);

  const renderTableBody = () => {
    switch (type) {
      case 'Reports':
        return <ReportTableBody data={history} />;
      case 'Detailed Audit':
        return <AuditTableBody data={[1, 2, 3]} type="detailed" />;
      case 'Quick Audit':
        return <AuditTableBody data={[1, 2, 3]} type="quick" />;
      case 'Code Audit':
        return <AuditTableBody data={[1, 2, 3]} code />;
      default:
        break;
    }
  };
  const handleTableTypeChange = (value: string) => {
    setType(value);
    if (value === 'Reports') setTableHead(reportsTableHead);
    if (value === 'Detailed Audit') setTableHead(auditTableHead);
    if (value === 'Quick Audit') setTableHead(auditTableHead);
    if (value === 'Code Audit') setTableHead(codeAuditTableHead);
    console.log(value);
  };
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/credit/history/txn');
      const json = await res.json();
      console.log(json);

      setHistory(json.txn);
    }
    fetchData();
  }, []);

  if (history.length === 0) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex flex-col pb-8">
          <h1 className="text-lg font-semibold">Your history</h1>
        </div>
        <div className="flex flex-col">
          <p className="text-md text-zinc-500">No history yet</p>
        </div>
      </div>
    );
  }
  const Typeconfig: typeconfig = {
    detailed: 'Detailed audit',
    code: 'Code audit',
    report: 'Report generation',
    quick: 'Quick audit',
  };
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex max-md:flex-col max-md:mb-6 gap-4 items-start justify-between">
        <div className="flex flex-col md:pb-8 max-md:pl-3">
          <h1 className="text-lg font-semibold">Your Audits</h1>
          <p className="text-md text-zinc-500">Items you have unlocked</p>
        </div>
        <Select onValueChange={handleTableTypeChange}>
          <SelectTrigger className="max-md:w-full outline-none">
            <div className="flex items-center gap-6 justify-between text-sm pl-3">
              {type}
              <BiChevronDown className="text-neutral-400 text-[28px]" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Reports">Reports</SelectItem>
            <SelectItem value="Detailed Audit">Detailed Audit</SelectItem>
            <SelectItem value="Quick Audit">Quick Audit</SelectItem>
            <SelectItem value="Code Audit">Code Audit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table className="p-3 border border-zinc-800 w-full">
        <TableHeader className="">
          {tableHead.map((item, i) => (
            <TableHead
              key={i}
              className="py-4 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center"
            >
              {item}
            </TableHead>
          ))}
        </TableHeader>
        {renderTableBody()}
      </Table>
    </div>
  );
};

export default UserAccountTable;
