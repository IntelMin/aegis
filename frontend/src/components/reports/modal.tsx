import { formatAddress } from '@/utils/format-address';
import copy from 'copy-to-clipboard';
import { set } from 'date-fns';
import Image from 'next/image';
import React, { use, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { toast } from '../ui/use-toast';
import ScaleLoader from 'react-spinners/ScaleLoader';
import usePayment from '@/hooks/usePayment';
import useBalance from '@/hooks/useBalance';
import { useSession } from 'next-auth/react';
import PaymentDialog from '../payment-dialog';

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
  const session = useSession();
  const { balance, setBalance } = useBalance(
    session.data?.user?.email as string
  );
  const { handlePayment, loading } = usePayment({
    balance,
    toast,
    onSuccess: () => {
      requestReport(tokenState?.tokenAddress);
    },
  });
  const [submitting, setSubmitting] = React.useState(false);
  const requestReport = async (address: string) => {
    setSubmitting(true);
    const response = await fetch(`/api/audit/report?address=${address}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 404) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Report not found.',
      });
      setSubmitting(false);
      return;
    }

    if (response.ok) {
      const data = await response.json();
      if (data.status === 'failed') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.message,
        });
        setSubmitting(false);
        return;
      }
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
        setSubmitting(false);
        document.body.removeChild(link);
        toast({
          variant: 'default',
          title: 'Success',
          description: 'Report downloaded successfully.',
        });
      }
    }
  };
  const handleCopy = (data: string) => {
    copy(data);
  };

  return (
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
            <Image src="/icons/copy.svg" alt="copy" width={12} height={12} />
          </button>
        </div>
        <div className="flex flex-col justify-center gap-6">
          {tokenState.loading ? (
            <p className="text-zinc-300 text-sm font-[300] flex items-center justify-center">
              Loading...
            </p>
          ) : (
            <div className="h-[200px] overflow-y-scroll">
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
          {submitting || loading ? (
            <div className="flex items-center justify-center bg-[#0E76FD] w-full p-2">
              <ScaleLoader width={4} height={10} color="white" />
            </div>
          ) : (
            <PaymentDialog
              service="report"
              balance={balance}
              handlePayment={handlePayment}
              TriggerElement={
                <button
                  className="bg-[#0E76FD] p-2 flex items-center justify-center gap-1 w-full"
                  // onClick={() => requestReport(tokenState?.tokenAddress)}
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
                    Download Report
                  </p>
                </button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
