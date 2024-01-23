'use client';
import { Button } from '@/components/ui/button';
import { Table, TableHead, TableHeader } from '@/components/ui/table';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';

import React, { useEffect } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { SelectTrigger } from '@radix-ui/react-select';
import { ReportTableBody } from '@/components/history/report';
import { AuditTableBody } from '@/components/history/audit';
import { Loader } from 'lucide-react';

type typeconfig = {
  [key: string]: string;
  detailed: string;
  code: string;
  report: string;
  quick: string;
};
const UserAccountTable = () => {
  const [history, setHistory] = React.useState([]);
  const [detailed_history, setDetailedHistory] = React.useState([]);
  const [quick_history, setQuickHistory] = React.useState([]);
  const [code_history, setCodeHistory] = React.useState([]);
  const [report_history, setReportHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState('Reports');

  const reportsTableHead = ['TOKEN', 'DATE', 'FILE'];
  const auditTableHead = ['TOKEN', 'DATE', 'VIEW'];
  const codeAuditTableHead = ['DATE', 'VIEW'];

  const [tableHead, setTableHead] = React.useState(reportsTableHead);

  const renderTableBody = () => {
    switch (type) {
      case 'Reports':
        return <ReportTableBody data={report_history} />;
      case 'Detailed Audit':
        return <AuditTableBody data={detailed_history} type="detailed" />;
      case 'Quick Audit':
        return <AuditTableBody data={quick_history} type="quick" />;
      case 'Code Audit':
        return <AuditTableBody data={code_history} code />;
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
      setLoading(true);

      const paid_audits = await fetch('/api/credit/paidaudit');
      const paid_audits_json = await paid_audits.json();

      if (paid_audits_json.paid_audits.length > 0) {
        setDetailedHistory(
          paid_audits_json.paid_audits.filter(
            (item: any) => item.type == 'detailed'
          )
        );
        setQuickHistory(
          paid_audits_json.paid_audits.filter(
            (item: any) => item.type == 'quick'
          )
        );
        setCodeHistory(
          paid_audits_json.paid_audits.filter(
            (item: any) => item.type == 'code'
          )
        );
        setReportHistory(
          paid_audits_json.paid_audits.filter(
            (item: any) => item.type == 'report'
          )
        );
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader className="w-6 h-6 text-blue-400" />
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
          <SelectTrigger className="w-full md:w-[180px] outline-none">
            <div className="flex items-center justify-between text-sm pl-3">
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
