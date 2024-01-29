'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { AUDIT_STATUS_RETURN_CODE } from '@/utils/audit-statuses';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { Loader } from 'lucide-react';
import usePayment from '@/hooks/usePayment';
import AuditDetail from '@/components/audit/detail';

type Props = {
  params: {
    id: string;
  };
};

const getStatusText = (statusCode: number) => {
  switch (statusCode) {
    case AUDIT_STATUS_RETURN_CODE.notRequested:
      return 'REQUESTING';
    case AUDIT_STATUS_RETURN_CODE.pending:
      return 'PROCESSING';
    case AUDIT_STATUS_RETURN_CODE.partial:
      return 'PROCESSING';
    case AUDIT_STATUS_RETURN_CODE.complete:
      return 'COMPLETE';
    case AUDIT_STATUS_RETURN_CODE.errorFetchingDb:
    default:
      return 'An error occurred, please try again later or contact support';
  }
};

const getProgressMessage = (progress: number) => {
  if (progress < 20) {
    return 'Initializing audit protocols...';
  } else if (progress < 40) {
    return 'Analyzing contract structures...';
  } else if (progress < 60) {
    return 'Examining smart contract dependencies...';
  } else if (progress < 80) {
    return 'Performing security checks and optimizations...';
  } else if (progress < 100) {
    return 'Finalizing audit and compiling report...';
  } else {
    return 'Audit complete!';
  }
};

const DetailedPage = ({ params }: Props) => {
  const router = useRouter();
  const contractAddress = params.id;
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(AUDIT_STATUS_RETURN_CODE.notRequested);
  const [statusProgress, setStatusProgress] = useState(0);
  const [statusEta, setStatusEta] = useState<number | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { fetchPaidStatus, isFetchingPaid, hasPaid } = usePayment();

  const requestAudit = async () => {
    try {
      const response = await fetch('/api/audit/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'audit_request',
          address: contractAddress,
        }),
      });
      if (!response.ok) {
        console.error('Error requesting audit:', response);
        if (timer.current) clearInterval(timer.current);
      }
    } catch (error) {
      console.error('Error requesting audit:', error);
    }
  };

  const pollStatus = async () => {
    if (timer.current) clearInterval(timer.current);

    try {
      const response = await fetch('/api/audit/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'audit_status',
          address: contractAddress,
        }),
      });
      const auditData = await response.json();
      console.log({ auditData });

      setStatus(auditData.status);
      switch (auditData.status) {
        case AUDIT_STATUS_RETURN_CODE.notRequested:
          requestAudit();
        // Fall through to start polling
        case AUDIT_STATUS_RETURN_CODE.pending:
        case AUDIT_STATUS_RETURN_CODE.partial:
          setStatus(auditData.status);
          setStatusProgress(auditData.progress);

          if (statusEta === null) {
            setStatusEta(auditData.eta);
          }

          timer.current = setInterval(pollStatus, 5000);
          break;
        case AUDIT_STATUS_RETURN_CODE.complete:
          if (timer.current) clearInterval(timer.current);
          setLoading(false);
          break;
      }
    } catch (error) {
      console.error('Error polling data:', error);
      setStatus(4);
    }
  };

  useEffect(() => {
    if (!contractAddress) return;

    console.log('contract', contractAddress);

    fetchPaidStatus('detailed', contractAddress);
  }, [contractAddress]);

  useEffect(() => {
    if (isFetchingPaid) {
      return;
    }

    if (hasPaid === false) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please pay to audit this token',
      });
      router.push(`/audit/token/${params.id}`);
    } else {
      if (timer.current) clearInterval(timer.current);
      //   console.log(`Payment has been made: ${hasPaid}`);
      pollStatus();
    }

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [isFetchingPaid]);

  if (isFetchingPaid || !hasPaid) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen text-white">
        <div className="text-lg font-bold text-center">
          <Loader className="animate-spin mb-2" />
        </div>
        <>Checking payment status...</>
      </div>
    );
  }

  if (loading) {
    const progressMessage = getProgressMessage(statusProgress);
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen text-white">
        <div className="text-lg font-bold text-center w-[200px] mb-10">
          <p className="mb-5 text-gray-200 animate-pulse">Loading...</p>
          <Progress value={statusProgress} />
        </div>
        <div className="text-lg font-bold text-center">
          <p className="mt-2">{progressMessage}</p>
          <p className="mt-2 text-xs text-gray-400">
            {getStatusText(status)}
            {getStatusText(status) === 'PROCESSING' && (
              <span>
                {statusEta !== null && statusEta > 0
                  ? ` (${Math.floor(statusEta / 60)} ${
                      Math.floor(statusEta / 60) === 1 ? 'minute' : 'minutes'
                    } remaining)`
                  : 'Calculating ETA...'}
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  return <AuditDetail contractAddress={contractAddress} />;
};

export default DetailedPage;
