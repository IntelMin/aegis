'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { showToast } from '@/components/toast';
import { Modal } from '@/components/reports/modal';
import { ReportsTable } from '@/components/reports/table';
import PaymentDialog from '@/components/payment/dialog';
import useAddressVerification from '@/hooks/useAddressVerification';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoCircledIcon } from '@radix-ui/react-icons';

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
  const [requestAddress, setRequestAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { checkAddress, isCheckingAddress } = useAddressVerification();
  const [isAddressValid, setIsAddressValid] = useState(false);

  const requestSentRef = useRef(false);
  const downloadInitiatedRef = useRef(false);

  const intervalIdRef = useRef<NodeJS.Timeout | number | null>(null);
  const [startPolling, setStartPolling] = useState(false);

  useEffect(() => {
    const pollForReport = async () => {
      try {
        const contractAddress = requestAddress;
        const response = await fetch(
          `/api/audit/report?address=${contractAddress}`
        );
        if (!response.ok) {
          throw new Error('Invalid contract address');
        }

        const reportData = await response.json();
        if (reportData.status === 'success') {
          setStartPolling(false);
          downloadReport(reportData);
        } else if (reportData.status === 'failed') {
          setStartPolling(false);
          handleError(reportData.message);
        }
      } catch (error: any) {
        console.error('Error in polling report:', error);
        setStartPolling(false);
        handleError(error?.message);
      }
    };

    if (startPolling) {
      pollForReport();
      intervalIdRef.current = setInterval(pollForReport, 15000);
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      if (startPolling) {
        setStartPolling(false);
      }
      requestSentRef.current = false;
      downloadInitiatedRef.current = false;
    };
  }, [startPolling]);

  const requestNewReport = async (address: string) => {
    if (requestSentRef.current) {
      return;
    }

    const contractAddress = address;
    try {
      setSubmitting(true);
      requestSentRef.current = true;

      const response = await fetch('/api/audit/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: contractAddress }),
      });
      const data = await response.json();

      if (data.status === 'failed') {
        handleError(data.message);
        return;
      }

      if (data.status === 'success' || data.status === 'requested') {
        setStartPolling(true);
      }
    } catch (error) {
      console.error('Error requesting report:', error);
      handleError('An error occurred while requesting the report.');
    } finally {
      requestSentRef.current = false;
    }
  };

  const handleError = (message: string) => {
    showToast({
      type: 'error',
      message: 'Error',
      description: message,
    });
    setSubmitting(false);
  };

  const downloadReport = (data: any) => {
    if (downloadInitiatedRef.current) {
      return;
    }

    downloadInitiatedRef.current = true;

    const pdfData = data.report;

    showToast({
      type: 'success',
      message: 'Success',
      description: 'Your report has been downloaded.',
    });

    const byteCharacters = atob(pdfData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download =
      data.name && data.name !== 'undefined'
        ? `${data.name}.pdf`
        : 'report.pdf';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(pdfUrl);

    downloadInitiatedRef.current = false;

    setSubmitting(false);
  };

  //   const handleOutsideClick = (event: MouseEvent) => {
  //     const modal = document.querySelector('.modal');
  //     if (modal && !modal.contains(event.target as Node)) {
  //       setShowModal(false);
  //     }
  //   };

  //   useEffect(() => {
  //     document.addEventListener('mousedown', handleOutsideClick);

  //     return () => {
  //       document.removeEventListener('mousedown', handleOutsideClick);
  //     };
  //   }, []);

  return (
    <div className="min-h-screen w-full">
      <div
        className="flex items-center justify-center w-full h-[300px]"
        style={{
          background: 'url(/backgrounds/report-request.png)',
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
            value={requestAddress}
            disabled={submitting}
            onChange={e => {
              setRequestAddress(e.target.value);
            }}
          />

          <button
            className="bg-[#0E76FD] p-2 flex items-center justify-center gap-1 w-[200px]"
            // disabled={submitting || isCheckingAddress}

            // onClick={() => requestReport(tokenState?.tokenAddress)}
          >
            <PaymentDialog
              service="report"
              address={requestAddress}
              onPrep={async () => {
                console.log(`onPrep check`);
                const isValid = await checkAddress(requestAddress);
                if (!isValid) {
                  setIsAddressValid(false);
                  return false;
                } else {
                  setIsAddressValid(true);
                  return true;
                }
              }}
              UnlockedElement={
                <div className="flex flex-row w-full items-center justify-center">
                  {submitting ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                      <p className="text-[16px] font-[500] text-zinc-50">
                        Generating
                      </p>
                    </>
                  ) : (
                    <>
                      <Image
                        src="/icons/nav/reports.svg"
                        alt="report-icon"
                        className="mr-2"
                        width={16}
                        height={16}
                        style={{
                          filter:
                            'invert(100%) brightness(1000%) contrast(100%)',
                        }}
                      />
                      <p className="text-[16px] font-[500] text-zinc-50">
                        Generate Report
                      </p>
                    </>
                  )}
                </div>
              }
              LockedElement={
                <div className="flex flex-row items-center">
                  <Lock className="mr-2 w-5 h-5" />
                  <p className="text-[16px] font-[500] text-zinc-50">
                    Generate Report
                  </p>
                </div>
              }
              onSuccess={() => requestNewReport(requestAddress)}
            />
          </button>
        </div>
      </div>
      {submitting && (
        <Alert className="m-2 w-1/4 m-auto mb-3">
          <InfoCircledIcon className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Your report is now being generated. It will automatically download
              once it&apos;s ready.
            </p>
            <p>
              <strong>Important:</strong> It may take up to 5 minutes to
              generate your report. Your patience is appreciated.
            </p>
          </AlertDescription>
        </Alert>
      )}

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
            setShowModal={setShowModal}
            setTokenState={setTokenState}
            tokenState={tokenState}
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
