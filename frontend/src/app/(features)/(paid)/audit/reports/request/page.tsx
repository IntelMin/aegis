'use client';

import { tableData, tablehead } from '@/components/reports/constant';
import { Modal } from '@/components/reports/modal';
import { ReportsTable } from '@/components/reports/table';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = {};
type tokenState = {
  tokenIcon: string;
  tokenName: string;
  tokenInfo?: string | undefined;
  tokenAddress: string;
  loading?: boolean;
};
const RequestReportPage = (props: Props) => {
  const [tokenState, setTokenState] = useState<tokenState>({
    tokenIcon: '',
    tokenName: '',
    tokenInfo: '',
    tokenAddress: '',
    loading: false,
  });

  const requestNewReport = async (address: string) => {
    const contractAddress = address;
    try {
      const response = await fetch('/api/audit/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: contractAddress,
        }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        const intervalId = setInterval(async () => {
          const response = await fetch(
            `/api/audit/report?address=${contractAddress}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          );
          console.log(response);

          if (response.ok) {
            const data = await response.json();
            if (data.status === 'success') {
              const pdfData = data.report; // base64-encoded PDF data
              const pdfBlob = new Blob([atob(pdfData)], {
                type: 'application/pdf',
              });
              const pdfUrl = URL.createObjectURL(pdfBlob);
              const link = document.createElement('a');
              link.href = pdfUrl;
              link.download =
                data.name != 'undefined' ? `${data.name}` : 'report.pdf'; // specify the filename for the downloaded PDF

              // Append the link to the body
              document.body.appendChild(link);

              // Programmatically click the link to start the download
              link.click();

              // Remove the link when done
              document.body.removeChild(link);
              clearInterval(intervalId);
            }
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Error requesting report:', error);
    }
  };

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
