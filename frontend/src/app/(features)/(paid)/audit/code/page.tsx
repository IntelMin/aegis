'use client';
import React, { use, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ScaleLoader from 'react-spinners/ScaleLoader';
import CodeEditor from '@/components/audit/code-editor';
import { useSession } from 'next-auth/react';
import useBalance from '@/hooks/useBalance';
import usePayment from '@/hooks/usePayment';
import PaymentDialog from '@/components/payment-dialog';

const CodeAudit = () => {
  const { toast } = useToast();
  const session = useSession();

  const [ContractCode, setContractCode] = React.useState<string>('');
  const [findings, setFindings] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  //To do handle this
  const [nofindings, setNoFindings] = React.useState<boolean>(false);

  const { balance, setBalance } = useBalance(
    session.data?.user?.email as string
  );
  const { handlePayment, loading: paymentloading } = usePayment({
    balance,
    toast,
    onSuccess: () => {
      afterPayment();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    if (ContractCode === '') {
      toast({
        variant: 'destructive',
        title: 'Missing value',
        description: 'Please add valid contract code',
      });
      return;
    }
  };
  const afterPayment = async () => {
    try {
      setLoading(true);
      const data = {
        type: 'code',
        source: ContractCode,
      };

      const response = await fetch('/api/audit/code', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setLoading(false);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An error occurred during code audit',
        });
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setLoading(false);
      const result = await response.json();
      setFindings(result.findings);
    } catch (error) {
      console.error('Error during code audit:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred during code audit',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-4">
      <div className="space-y-8 md:px-5 md:py-5">
        <div className="items-center justify-center w-full space-y-8 text-center flex-cols md:flex md:justify-between px-3">
          <div className="space-y-3 text-start">
            <h1 className="text-2xl text-white text-semibold">Code Audit</h1>
            <h1 className="text-md text-neutral-300">
              Paste token contract code below to audit code.
            </h1>
          </div>
          <PaymentDialog
            service="code"
            balance={balance}
            handlePayment={handlePayment}
            TriggerElement={
              <Button
                type="button"
                disabled={loading || paymentloading}
                className={`text-white text-sm md:px-28 w-full md:w-[387px] py-2 bg-[#0E76FD] md:space-y-4 gap-2 ${
                  loading ? 'active' : ''
                }`}
                onClick={() => setOpen(true)}
              >
                {loading ? 'Auditing' : 'Audit your code'}{' '}
                {(loading || paymentloading) && (
                  <ScaleLoader width={4} height={10} color="black" />
                )}
              </Button>
            }
          />
        </div>

        <CodeEditor
          source={ContractCode}
          setContractCode={setContractCode}
          findings={findings}
          tree={null}
          readonly={false}
        />
      </div>
    </form>
  );
};

export default CodeAudit;
