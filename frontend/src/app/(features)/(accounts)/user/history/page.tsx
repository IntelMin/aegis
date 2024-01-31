'use client';
import { Button } from '@/components/ui/button';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';

import React, { useEffect, useState } from 'react';
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
  const [allAudits, setAllAudits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('report');

  const tableHeads = {
    report: ['TOKEN', 'DATE', 'FILE'],
    detailed: ['TOKEN', 'DATE', 'VIEW'],
    quick: ['TOKEN', 'DATE', 'VIEW'],
    code: ['DATE', 'VIEW'],
  };

  const Typeconfig: any = {
    detailed: 'Detailed Audit',
    code: 'Code Audit',
    report: 'Reports',
    quick: 'Quick Audit',
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch('/api/credit/paid');
        const data = await response.json();
        console.log(`paid audits: ${data.paid_audits}`);
        setAllAudits(data.paid_audits || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredAudits = () => {
    return allAudits.filter(
      (audit: any) => audit.type === type.toLowerCase().trim()
    );
  };

  const renderTableBody = () => {
    const data = filteredAudits();
    switch (type) {
      case 'report':
        console.log(`report data: ${data}`);
        return <ReportTableBody data={data} />;
      case 'detailed':
        return <AuditTableBody data={data} type="detailed" />;
      case 'quick':
        return <AuditTableBody data={data} type="quick" />;
      case 'code':
        return <AuditTableBody data={data} code />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader className="w-6 h-6 text-blue-400 animate-spin" />
      </div>
    );
  }

  const handleTableTypeChange = (value: string) => {
    setType(value);
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
              {Typeconfig[type]}
              <BiChevronDown className="text-neutral-400 text-[28px]" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="report">Reports</SelectItem>
            <SelectItem value="detailed">Detailed Audit</SelectItem>
            <SelectItem value="quick">Quick Audit</SelectItem>
            <SelectItem value="code">Code Audit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table className="p-3 border border-zinc-800 w-full">
        <TableHeader className="">
          <TableRow>
            {tableHeads[type as keyof typeof tableHeads]?.map((item, index) => (
              <TableHead
                key={index}
                className="py-4 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center"
              >
                {item}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {renderTableBody()}
      </Table>
    </div>
  );
};

export default UserAccountTable;
