'use client';
import React, { use, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ScaleLoader from 'react-spinners/ScaleLoader';
import CodeEditor from '@/components/audit/code-editor';
import { useSession } from 'next-auth/react';
import useBalance from '@/hooks/useBalance';
import usePayment from '@/hooks/usePayment';
import PaymentDialog from '@/components/payment/dialog';
import { showToast } from '@/components/toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const CodeAudit = () => {
  const session = useSession();

  const [ContractCode, setContractCode] = React.useState<string>('');
  const [codeHash, setCodeHash] = React.useState<string>('');
  const [findings, setFindings] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  //To do handle this
  const [nofindings, setNoFindings] = React.useState<boolean>(false);

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setOpen(false);
  //     if (ContractCode === '') {
  //       showToast({
  //         type: 'error',
  //         message: 'Missing value',
  //         description: 'Please add valid contract code',
  //       });
  //       return;
  //     }
  //   };

  const generateHash = async () => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(ContractCode);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);

      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (error) {
      console.error('Hash generation failed:', error);
      return '';
    }
  };

  useEffect(() => {
    setLoading(true);
    generateHash().then(hash => {
      console.log(hash);
      setCodeHash(hash);
      setLoading(false);
    });
  }, [ContractCode]);

  const afterPayment = async (source_code: string) => {
    try {
      setLoading(true);
      const data = {
        type: 'code',
        source: source_code,
      };

      const response = await fetch('/api/audit/code', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        showToast({
          type: 'error',
          message: 'Error',
          description: 'An error occurred during code audit',
        });
        return false;
      }

      setLoading(false);

      const result = await response.json();
      console.log(result);
      if (result.message === 'No vulnerabilities found.') {
        setNoFindings(true);
        showToast({
          type: 'success',
          message: 'Info',
          description: 'No vulnerabilities found',
        });
      }

      setFindings(result.findings);
    } catch (error) {
      console.error('Error during code audit:', error);
      showToast({
        type: 'error',
        message: 'Error',
        description: 'An error occurred during code audit',
      });
    }
  };

  return (
    <div className="space-y-8 max-md:w-full md:px-6 md:py-5">
      <div className="items-center justify-center w-full space-y-8 text-center flex-cols md:flex md:justify-between px-3 pr-5">
        <div className="space-y-3 text-start">
          <h1 className="text-2xl text-white text-semibold">Code Audit</h1>
          <h1 className="text-md text-neutral-300">
            Paste token contract code below to audit code.
          </h1>
        </div>
        <Button
          type="button"
          disabled={loading}
          className={`bg-[#0E76FD] [text-white text-sm md:px-28 w-full md:w-[387px] py-2 md:space-y-4 gap-2 ${
            loading ? 'active' : ''
          }`}
          style={{ backgroundColor: '#0E76FD', color: '#fff' }}
        >
          <PaymentDialog
            service="code"
            address={codeHash}
            onPrep={async () => {
              if (ContractCode === '') {
                showToast({
                  type: 'error',
                  message: 'No code found',
                  description: 'Please add valid contract code',
                });
                return false;
              } else {
                return true;
              }
            }}
            UnlockedElement={
              <div className="flex flex-row w-full justify-center items-center">
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin mr-1" />
                    <p className="text-[16px] font-[500] text-zinc-50">
                      Auditing
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[16px] font-[500] text-zinc-50">
                      Audit your code
                    </p>
                  </>
                )}
              </div>
            }
            LockedElement={
              <div className="flex flex-row">
                <p className="text-[16px] font-[500] text-zinc-50">
                  Audit your code
                </p>
              </div>
            }
            onSuccess={() => afterPayment(ContractCode)}
          />
        </Button>
      </div>

      <CodeEditor
        source={ContractCode}
        setContractCode={setContractCode}
        findings={findings}
        tree={null}
        readonly={false}
        nofindings={nofindings}
      />
    </div>
  );
};

export default CodeAudit;
