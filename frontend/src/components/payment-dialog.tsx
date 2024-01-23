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
import { set } from 'date-fns';
interface PaymentDialogProps {
  balance: number | null;
  service: CreditType;
  handlePayment: (type: CreditType) => void;
  TriggerElement?: React.ReactNode;
  DummyElement?: React.ReactNode;
  open?: boolean;
}
const PaymentDialog = ({
  balance,
  service,
  handlePayment,
  TriggerElement,
  DummyElement,
  open,
}: PaymentDialogProps) => {
  const required_credits = creditConfig[service];
  const [openDialog, setOpenDialog] = React.useState(false);
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
              You have {balance ? balance : 0} credits available. You need{' '}
              {required_credits} credits{' '}
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
          <DialogClose>
            <Button type="submit" onClick={() => handlePayment(service)}>
              Confirm to pay {required_credits} credits
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
  }
};

export default PaymentDialog;
