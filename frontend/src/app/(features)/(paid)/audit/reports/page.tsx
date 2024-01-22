'use client';

import Image from 'next/image';

import { Modal } from '@/components/reports/modal';
import { ReportsTable } from '@/components/reports/table';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  // tableData,
  tablehead,
} from '@/components/reports/constant';
type tokenState = {
  tokenIcon: string;
  tokenName: string;
  tokenInfo?: string | undefined;
  tokenAddress: string;
  loading?: boolean;
};

const ReportsPage = () => {
  const [tokenState, setTokenState] = useState<tokenState>({
    tokenIcon: '',
    tokenName: '',
    tokenInfo: '',
    tokenAddress: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOutsideClick = (event: MouseEvent) => {
    const modal = document.querySelector('.modal'); // Adjust the selector based on your modal structure

    if (modal && !modal.contains(event.target as Node)) {
      setShowModal(false);
    }
  };


  // useEffect(() => {


  //   document.addEventListener('mousedown', handleOutsideClick);

  //   return () => {
  //     document.removeEventListener('mousedown', handleOutsideClick);
  //   };
  // }, []);


  return (
    <div className="w-full flex justify-center pt-16 relative">
      <div className="w-[80%] flex flex-col gap-8">
        <div className="w-full flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-zinc-200 font-bold">Reports</h1>
            <p className="text-[12px] text-zinc-400 text-[400]">
              Audit reports generated by community
            </p>
          </div>
          <Link
            href="/audit/reports/request"
            className="bg-[#0E76FD] p-2 flex items-center justify-center gap-1"
          >
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
              Request Report
            </p>
          </Link>
        </div>
        <ReportsTable
          tablehead={tablehead}
          setShowModal={setShowModal}
          setTokenState={setTokenState}
          tokenState={tokenState}
        />
      </div>
      {showModal && (
        <Modal tokenState={tokenState} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default ReportsPage;
