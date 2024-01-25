import React from 'react';
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
import Link from 'next/link';
import { CreditType, creditConfig } from '@/lib/credit-config';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface PaymentDialogProps {
  balance: number | null;
  service: CreditType;
  handlePayment: (type: CreditType) => Promise<any>;
  TriggerElement?: React.ReactNode;
  DummyElement?: React.ReactNode;
  open?: boolean;
  payInProgress?: boolean;
  paidUser?: boolean;
  onSuccess?: () => void;
}
const PaymentDialog = ({
  balance,
  service,
  handlePayment,
  TriggerElement,
  DummyElement,
  payInProgress,
  open,
  paidUser,
  onSuccess,
}: PaymentDialogProps) => {
  const required_credits = creditConfig[service];
  const [openDialog, setOpenDialog] = React.useState(false);

  if (required_credits === 0) {
    return <div onClick={() => handlePayment(service)}>{TriggerElement}</div>;
  }
  if (paidUser && onSuccess)
    return (
      <>
        <div onClick={() => onSuccess()}>{TriggerElement}</div>
      </>
    );

  if (balance == null || balance < required_credits) {
    return (
      <Dialog open={open ? open : undefined}>
        {TriggerElement ? (
          <DialogTrigger>{TriggerElement}</DialogTrigger>
        ) : (
          <></>
        )}
        {DummyElement ? <>{DummyElement}</> : <></>}

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Not Enough Credits</DialogTitle>
            <DialogDescription className="space-y-2 text-md">
              <p className="mt-3">
                {balance && balance > 0
                  ? `You currently have ${balance} credits available. `
                  : "It looks like you don't have any credits at the moment. "}
              </p>
              <p>
                <strong>{required_credits} credits</strong> are needed{' '}
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
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Dialog
        open={open ? open : openDialog}
        onOpenChange={() => {
          if (open) {
            setOpenDialog(!open);
          } else {
            setOpenDialog(!openDialog);
          }
        }}
      >
        {TriggerElement ? (
          <DialogTrigger>{TriggerElement}</DialogTrigger>
        ) : (
          <></>
        )}
        {DummyElement ? <>{DummyElement}</> : <></>}

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay for audit</DialogTitle>
            <DialogDescription>
              You have {balance} credits available. You need {required_credits}{' '}
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
              disabled={payInProgress}
              className="m-auto"
              onClick={() =>
                handlePayment(service).then(() => setOpenDialog(false))
              }
            >
              {payInProgress && (
                <AiOutlineLoading3Quarters className="animate-spin mr-1" />
              )}
              Confirm to pay {required_credits} credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
};

export default PaymentDialog;
