import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreditType, creditConfig } from '@/lib/credit-config';
interface PaymentDialogProps {
  balance: number | null;
  service: CreditType;
  handlePayment: (type: CreditType) => void;
  TriggerElement: React.ReactNode;
}
const PaymentDialog = ({
  balance,
  service,
  handlePayment,
  TriggerElement,
}: PaymentDialogProps) => {
  const required_credits = creditConfig[service];
  if (!balance) return null;
  return (
    <Dialog>
      <DialogTrigger>{TriggerElement}</DialogTrigger>
      {balance >= required_credits && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay for audit</DialogTitle>
            <DialogDescription>
              You have {balance} credits available. You need {required_credits}{' '}
              credits{' '}
              {service == 'code'
                ? 'to audit your code'
                : service == 'detailed'
                ? 'to perform detailed audit'
                : 'to get a PDF report'}
              .
            </DialogDescription>
          </DialogHeader>
          <DialogClose>
            <Button type="submit" onClick={() => handlePayment(service)}>
              Confirm to pay {required_credits} credits
            </Button>
          </DialogClose>
        </DialogContent>
      )}
      {balance < required_credits && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Credit balance low</DialogTitle>
            <DialogDescription>
              You have {balance} credits available. You need {required_credits}
              credits{' '}
              {service == 'code'
                ? 'to audit your code'
                : service == 'detailed'
                ? 'to perform detailed audit'
                : 'to get a PDF report'}
              . Please add credits to your account.
            </DialogDescription>
          </DialogHeader>
          <DialogClose>
            <Link href="/payment">
              <Button>Add credits</Button>
            </Link>
          </DialogClose>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default PaymentDialog;
