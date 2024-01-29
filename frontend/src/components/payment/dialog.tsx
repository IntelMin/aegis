import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/toast';
import { creditConfig, CreditType } from '@/lib/credit-config';
import usePayment from '@/hooks/usePayment';
import useBalance from '@/hooks/useBalance';
import PulseLoader from 'react-spinners/PulseLoader';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface PaymentDialogProps {
  service: CreditType;
  address?: string | undefined;
  LockedElement: React.ReactNode;
  UnlockedElement: React.ReactNode;
  onSuccess: () => void;
  onPrep: () => Promise<boolean>;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  service,
  address,
  LockedElement,
  UnlockedElement,
  onSuccess,
  onPrep,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const requiredCredits = creditConfig[service];
  const [status, setStatus] = useState('loading'); // 'loading', 'locked', 'unlocked'
  const { balance, isFetchingBalance } = useBalance();
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    fetchPaidStatus,
    handlePayment,
    isProcessingPayment,
    isFetchingPaid,
    hasPaid,
  } = usePayment();

  useEffect(() => {
    if (isFetchingBalance) {
      setStatus('loading');
    } else {
      setStatus('locked');
    }
  }, [isFetchingBalance]);

  useEffect(() => {
    if (address) {
      setStatus('locked');
    }
  }, [address]);

  const onPayment = async () => {
    await handlePayment(service, address).then(async () => {
      setStatus('unlocked');
      await fetchPaidStatus(service, address);
      onSuccess?.();
      setIsDialogOpen(false);
    });
  };

  const handleOpenModal = async () => {
    if (isDialogOpen) {
      setIsDialogOpen(false);
      setStatus('locked');
      return;
    }

    setStatus('loading');

    const shouldProceed = await onPrep?.();
    if (!shouldProceed) {
      setIsDialogOpen(false);
      setStatus('locked');
      return;
    }

    console.log('Preparation successful');

    if (status === 'locked') {
      await fetchPaidStatus(service, address);
      setIsProcessing(true);
      // console.log('hasPaid', hasPaid);
      // if (!hasPaid) {
      //   console.log("hasn't paid");
      //   setIsDialogOpen(true);
      //   return;
      // }
    }

    // setStatus('unlocked');
    // onSuccess?.();
  };

  useEffect(() => {
    if (!isProcessing) return;
    console.log('hasPaid', hasPaid);
    if (!hasPaid && service !== 'quick') {
      console.log("hasn't paid");
      setIsDialogOpen(true);
    } else {
      setStatus('unlocked');
      onSuccess?.();
    }

    return () => {
      setIsProcessing(false);
    };
  }, [hasPaid, isProcessing]);

  const renderTriggerElement = () => {
    switch (status) {
      case 'loading':
        return <PulseLoader color="white" size={8} className="p-2" />;
      case 'locked':
        return LockedElement;
      case 'unlocked':
        return UnlockedElement;
      default:
        return null;
    }
  };

  const renderDialogContent = () => {
    if (balance === null || balance < requiredCredits) {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Not Enough Credits</DialogTitle>
            <DialogDescription className="space-y-2 text-md">
              <p className="mt-3">
                {balance && balance > 0
                  ? `You currently have ${balance} credits available. `
                  : "It looks like you don't have any credits at the moment. "}
              </p>
              <p>
                <strong>{requiredCredits} credits</strong> are needed{' '}
                {service == 'code'
                  ? 'to audit your code. '
                  : service == 'detailed'
                  ? 'for a detailed audit. '
                  : service == 'quick'
                  ? 'for a quick audit. '
                  : 'to generate a PDF report. '}
              </p>
              <p>Please add more credits to your account to proceed.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogClose>
            <Link href="/payment">
              <Button>Add credits</Button>
            </Link>
          </DialogClose>
        </>
      );
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle>Pay for audit</DialogTitle>
          <DialogDescription>
            You have {balance} credits available. You need {requiredCredits}{' '}
            credits{' '}
            {service == 'code'
              ? 'to audit your code'
              : service == 'detailed'
              ? 'to perform a detailed audit'
              : 'to get a PDF report'}
            .
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={isProcessingPayment}
            className="m-auto"
            onClick={() => onPayment()}
          >
            {isProcessingPayment ? (
              <div className="flex flex-row items-center justify-center">
                <AiOutlineLoading3Quarters className="animate-spin mr-1" />{' '}
                Paying {requiredCredits} credits{' '}
              </div>
            ) : (
              <>Confirm to pay {requiredCredits} credits</>
            )}
          </Button>
        </DialogFooter>
      </>
    );
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleOpenModal}
      defaultOpen={false}
    >
      <DialogTrigger asChild>{renderTriggerElement()}</DialogTrigger>
      <DialogContent>{renderDialogContent()}</DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
