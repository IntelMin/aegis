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
}
const PaymentDialog = ({
  balance,
  service,
  handlePayment,
  TriggerElement,
  DummyElement,
  payInProgress,
  open,
}: PaymentDialogProps) => {
  const required_credits = creditConfig[service];
  const [openDialog, setOpenDialog] = React.useState(false);

  if (required_credits === 0) {
    return <div onClick={() => handlePayment(service)}>{TriggerElement}</div>;
  }

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
            <DialogTitle>Credit balance low</DialogTitle>
            <DialogDescription>
              You have {balance} credits available. You need {required_credits}{' '}
              credits{' '}
              {service == 'code'
                ? 'to audit your code'
                : service == 'detailed'
                ? 'to perform detailed audit'
                : service == 'quick'
                ? 'to get a quick audit'
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
                ? 'to perform detailed audit'
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
