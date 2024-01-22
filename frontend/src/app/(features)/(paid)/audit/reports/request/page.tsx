'use client';

import { tableData, tablehead } from '@/components/reports/constant';
import { Modal } from '@/components/reports/modal';
import { ReportsTable } from '@/components/reports/table';
import { toast } from '@/components/ui/use-toast';
import usePayment from '@/hooks/usePayment';
import useTokenInfo from '@/hooks/useTokenInfo';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';
import useBalance from '@/hooks/useBalance';
import PaymentDialog from '@/components/payment-dialog';
import { add, set } from 'date-fns';
type Props = {};
type tokenState = {
  tokenIcon: string;
  tokenName: string;
  tokenInfo?: string | undefined;
  tokenAddress: string;
  loading?: boolean;
};
type usertype = {
  id?: number;
  email?: string;
  username?: string;
  password?: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
};
const RequestReportPage = (props: Props) => {
  const session = useSession();
  const { balance, setBalance } = useBalance(
    session.data?.user?.email as string
  );
  const [user, setUser] = useState<usertype>({}); // user state
  const [tokenState, setTokenState] = useState<tokenState>({
    tokenIcon: '',
    tokenName: '',
    tokenInfo: '',
    tokenAddress: '',
    loading: false,
  });
  const [requestAddress, setRequestAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { handlePayment, loading } = usePayment({
    balance,
    toast,

    onSuccess: () => {
      requestNewReport(requestAddress);
      setOpen(false);
    },
  });

  const requestNewReport = async (address: string) => {
    const contractAddress = address;
    try {
      setSubmitting(true);

      const response = await fetch('/api/audit/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: contractAddress,
        }),
      });
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
        const intervalId = setInterval(async () => {
          const response = await fetch(
            `/api/audit/report?address=${contractAddress}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          );
          if (response.status === 404) {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Please enter a valid contract address',
            });
            setSubmitting(false);
            clearInterval(intervalId);
            return;
          }
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
              setSubmitting(false);
              clearInterval(intervalId);
            }
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Error requesting report:', error);
    }
  };

  const verifyAddress = async (address: string) => {
    const response = await fetch(`/api/token/check?token=${address}`);
    const res = await response.json();
    console.log(res);
    return res.data;
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    if (!requestAddress) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a valid contract address',
      });
      return;
    }
    if (requestAddress.slice(0, 2) !== '0x') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a valid contract address',
      });
      return;
    }
    const verify = await verifyAddress(requestAddress);
    console.log(verify);
    if (!verify) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a valid contract address',
      });
      return;
    }
    setOpen(true);
  };
  const [addressState, setAddressState] = useState('');

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    async function getuser() {
      const response = await fetch('/api/profile');
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        return data.user;
      }
    }
    getuser();
  }, []);

  const handleOutsideClick = (event: MouseEvent) => {
    const modal = document.querySelector('.modal'); // Adjust the selector based on your modal structure
    setOpen(false);
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
            onChange={e => {
              setRequestAddress(e.target.value);
            }}
          />
          <PaymentDialog
            service="report"
            balance={balance}
            handlePayment={handlePayment}
            open={open}
            DummyElement={
              <button
                type="submit"
                disabled={submitting || balance == null || addressState !== ''}
                className="bg-[#0E76FD] p-2 flex items-center justify-center gap-1"
                onClick={() => {
                  if (addressState !== '') {
                    toast({
                      variant: 'destructive',
                      title: 'Error',
                      description: 'Please enter a valid contract address',
                    });
                  } else {
                    handleSubmit();
                  }
                }}
              >
                {submitting ? (
                  <ScaleLoader width={6} height={12} color="white" />
                ) : (
                  <>
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
                  </>
                )}
              </button>
            }
          />
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
          {user ? (
            <ReportsTable
              tablehead={tablehead}
              setShowModal={setShowModal}
              setTokenState={setTokenState}
              tokenState={tokenState}
              user_id={user.id}
            />
          ) : (
            <>
              <div className="w-[full] flex justify-center items-center flex-col my-4">
                <Image
                  src="/icons/no-data.svg"
                  alt="no-data"
                  width={155}
                  height={150}
                />
                <p className="text-zinc-400 text-[12px] text-[400]">
                  Log in to see your reports
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {showModal && (
        <Modal tokenState={tokenState} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default RequestReportPage;
