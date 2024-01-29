import React, { useEffect } from 'react';
import axios from 'axios';
import copy from 'copy-to-clipboard';
import Image from 'next/image';
import { formatAddress } from '@/utils/format-address';
import { IoMdClose } from 'react-icons/io';
import { showToast } from '@/components/toast';
import PaymentDialog from '../payment/dialog';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Lock } from 'lucide-react';

type Props = {
  tokenState: {
    tokenIcon: string;
    tokenName: string;
    tokenInfo?: string;
    tokenAddress: string;
    loading?: boolean;
  };
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Modal = ({ tokenState, setShowModal }: Props) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  const requestReport = (address: string) => {
    setDownloading(true);

    axios
      .get(`/api/audit/report?address=${address}`)
      .then((response: any) => {
        const data = response.data;

        if (data.status === 'failed') {
          showToast({
            type: 'error',
            message: 'Error',
            description: 'Your report has not been generated yet.',
          });
          setDownloading(false);
          return;
        }

        if (data.status === 'success') {
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

          setDownloading(false);
        }
      })
      .catch((error: any) => {
        showToast({
          type: 'error',
          message: 'Error',
          description: 'There was an error fetching your report.',
        });
        setDownloading(false);
      })
      .finally(() => {
        setDownloading(false);
      });
  };

  const handleCopy = (data: string) => {
    copy(data);
    showToast({
      type: 'success',
      message: 'Success',
      description: 'Copied to clipboard.',
    });
  };

  return (
    <div className="absolute w-full h-full left-0 top-0">
      <div className="relative w-full h-full">
        <div
          className="absolute top-0 left-0 w-full h-screen backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        />
        <div className="modal fixed w-[340px] h-full right-4 top-36 z-[20] rounded-[4px]">
          <div
            className="w-[340px] relative h-[200px] flex items-center justify-center border border-b-0 border-zinc-800"
            style={{
              background: 'url(/backgrounds/report.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'top center',
            }}
          >
            <div className="p-3 rounded-full border border-dotted border-zinc-700 w-fit">
              <div className="p-3 rounded-full border border-dashed border-zinc-800 w-fit">
                <Image
                  src={
                    tokenState.tokenIcon
                      ? `/api/token/image?q=${tokenState.tokenIcon
                          .split('/')
                          .pop()}`
                      : `/icons/token-default.svg`
                  }
                  alt="token-icons"
                  width={48}
                  height={48}
                />
              </div>
            </div>
            <button
              type="button"
              className="absolute top-2 left-2"
              onClick={() => {
                setShowModal(false);
              }}
            >
              <IoMdClose className="text-2xl text-zinc-400" />
            </button>
          </div>
          <div className="p-4 bg-[#0D0D0D] flex flex-col gap-4 border border-t-0 border-zinc-800">
            <div className="flex gap-2 items-center">
              <p className="text-zinc-200 text-[16px] text-bold">
                {tokenState?.tokenName}
              </p>
              {/* <p className="text-zinc-500 text-sm text-[400]">
            {tokenState?.tokenInfo}
          </p> */}
            </div>
            <div className="flex items-center gap-1">
              <p className="text-[13px] text-blue-400">
                {formatAddress(tokenState?.tokenAddress)}
              </p>
              <button
                type="button"
                onClick={() => handleCopy(tokenState?.tokenAddress)}
              >
                <Image
                  src="/icons/copy.svg"
                  alt="copy"
                  width={12}
                  height={12}
                />
              </button>
            </div>
            <div className="flex flex-col justify-center gap-6">
              {tokenState.loading ? (
                <p className="text-zinc-300 text-sm font-[300] flex items-center justify-center">
                  Loading...
                </p>
              ) : (
                <div className="h-[200px] overflow-y-scroll space-y-2">
                  {tokenState?.tokenInfo
                    ?.split('.')
                    ?.slice(0, -1)
                    ?.map((item, i) => (
                      <p
                        className="text-sm text-zinc-300 font-[300] flex items-center"
                        key={i}
                      >
                        {item}.
                      </p>
                    ))}
                </div>
              )}
              <button
                className="bg-[#0E76FD] p-2 flex items-center justify-center gap-1 w-full"
                disabled={submitting}
                // onClick={() => requestReport(tokenState?.tokenAddress)}
              >
                <PaymentDialog
                  service="report"
                  address={tokenState?.tokenAddress}
                  onPrep={async () => {
                    return true;
                  }}
                  UnlockedElement={
                    <div className="flex flex-row w-full justify-center">
                      {submitting || downloading ? (
                        <>
                          <AiOutlineLoading3Quarters className="animate-spin mr-1" />
                          <p className="text-[16px] font-[500] text-zinc-50">
                            Downloading Report
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
                            Download Report
                          </p>
                        </>
                      )}
                    </div>
                  }
                  LockedElement={
                    <div className="flex flex-row">
                      <Lock className="mr-2" />
                      <p className="text-[16px] font-[500] text-zinc-50">
                        Unlock Report
                      </p>
                    </div>
                  }
                  onSuccess={() => requestReport(tokenState?.tokenAddress)}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
