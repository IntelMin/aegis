'use client';

import { tableData, tablehead } from '@/components/reports/constant';
import { Modal } from '@/components/reports/modal';
import { ReportsTable } from '@/components/reports/table';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = {};

const RequestReportPage = (props: Props) => {
  const [tokenState, setTokenState] = useState({
    tokenIcon: '',
    tokenName: '',
    tokenInfo: '',
    tokenAddress: '',
  });

  const [showModal, setShowModal] = useState(false);
  const handleOutsideClick = (event: MouseEvent) => {
    const modal = document.querySelector('.modal'); // Adjust the selector based on your modal structure

    if (modal && !modal.contains(event.target as Node)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  return (
    <div className="min-h-screen w-full">
      <div
        className="flex items-center justify-center w-full h-[300px]"
        style={{
          background: 'url(/backgrounds/request-report.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <h1 className="font-[600] text-[40px] text-center text-neutral-50">
          Request Audit Report
        </h1>
      </div>
      {/* Input Section */}
      <div className="flex items-center justify-center -translate-y-1/2">
        <div className="w-[590px] flex items-center bg-zinc-900 p-3 border border-zinc-700 gap-3">
          <input
            type="text"
            placeholder="Token address"
            className="border-0 bg-transparent px-2 border-r border-r-zinc-700 flex-1 outline-none"
          />
          <button className="bg-[#0E76FD] p-2 flex items-center justify-center gap-1">
            <Image
              src="/icons/nav/reports.svg"
              alt="report-icon"
              width={16}
              height={16}
              style={{
                filter: 'invert(100%) brightness(1000%) contrast(100%)',
              }}
            />
            <p className="text-[16px] font-[500] text-zinc-50">
              Generate Report
            </p>
          </button>
        </div>
      </div>
      {/* Request Section */}
      <div className="flex flex-col items-center justify-center gap-6">
        <Link
          href="/audit/reports"
          className="text-blue-400 text-[16px] font-[400]"
        >
          View All Reports
        </Link>
        <div className="w-[80%]">
          <ReportsTable
            tablehead={tablehead}
            tableData={[]}
            setShowModal={setShowModal}
            setTokenState={setTokenState}
          />
        </div>
      </div>
      {showModal && (
        <Modal tokenState={tokenState} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default RequestReportPage;
