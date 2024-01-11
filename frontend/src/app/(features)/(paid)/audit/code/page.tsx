'use client';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ScaleLoader from 'react-spinners/ScaleLoader';
import CodeEditor from '@/components/audit/code-editor';
import { useSession } from 'next-auth/react';

const CodeAudit = () => {
  const { toast } = useToast();
  const session = useSession();
  const [activeComponent, setActiveComponent] =
    React.useState<string>('contractCode');
  const [ContractCode, setContractCode] = React.useState<string>('');
  const [findings, setFindings] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [balance, setBalance] = React.useState<number>(0);
  useEffect(() => {
    const getBalance = async () => {
      console.log(session?.data?.user?.email);
      const r = await fetch('/api/credit/pay', {
        method: 'POST',
        body: JSON.stringify({
          email: session?.data?.user?.email,
          amount: 1,
        }),
      });
      const res = await fetch('/api/credit/balance', {
        method: 'POST',
        body: JSON.stringify({
          type: 'code',
        }),
      });
      const data = await res.json();
      setBalance(data?.balance);
    };
    if (session?.data?.user?.email) {
      getBalance();
    }
  }, [session?.data?.user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ContractCode === '') {
      toast({
        variant: 'destructive',
        title: 'Missing value',
        description: 'Please add valid contract code',
      });
      return;
    }

    setLoading(true);

    try {
      const data = {
        type: 'code',
        source: ContractCode,
      };

      const response = await fetch('/api/audit/code', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An error occurred during code audit',
        });
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setFindings(result.findings);
    } catch (error) {
      console.error('Error during code audit:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred during code audit',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (component: string) => {
    setActiveComponent(component);
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

          <Button
            type="submit"
            disabled={loading}
            className={`text-white text-sm md:px-28 w-full md:w-[387px] py-2 bg-[#0E76FD] md:space-y-4 ${
              loading ? 'active' : ''
            }`}
          >
            {loading ? 'Auditing' : 'Audit your code'}{' '}
            {loading && <ScaleLoader width={4} height={10} color="white" />}
          </Button>
        </div>
        {/* <div className="flex space-x-2 space-y-0 md:hidden ">
          <Button
            onClick={() => handleButtonClick('contractCode')}
            className={`text-neutral-200 text-md font-semibold md:px-28 w-full p-2 bg-zinc-900 space-y-4 ${
              activeComponent === 'contractCode'
                ? 'active'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            Contract Code
          </Button>
          <Button
            onClick={() => handleButtonClick('findings')}
            className={`text-neutral-200 text-md space-x-2 font-semibold md:px-28 w-full p-2 bg-zinc-900 space-y-4 ${
              activeComponent === 'findings'
                ? 'active'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            Findings
            <p className="animate-pulse">🟢</p>
          </Button>
        </div> */}
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
