"use client";

import { Button, Input } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";
import AuditReport from "../auditReport";
import GoToOtherType from "../GoToOtherType";

type Props = {};


const AddressAuditForm = (props: Props) => {
  const [activeaudit,Setactiveaudit] = useState<boolean>(false); // [activeaudit, setActiveaudit
  const [contractAddress, setContractAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const queryAudit = async (address: string) => {
    try {
      Setactiveaudit(true)
      const response = await fetch('/api/audit', {
        method: 'POST',
        body: JSON.stringify({ address }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to query audit');
      }
  
      const data = await response.json();
      // Process the response data here
      console.log(data)
  
    } catch (error) {
      console.error('Error querying audit:', error);
      // Handle the error here
    }
  };
  const queryAuditStatus = async (address: string) => {
    try {
      const response = await fetch('/api/audit', {
        method: 'GET',
        body: JSON.stringify({ address }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to query audit');
      }
  
      const data = await response.json();
      // Process the response data here
      
      if(data.status == "completed"){
        queryAudit(address)
        Setactiveaudit(false)
      }
  
    } catch (error) {
      console.error('Error querying audit:', error);
      // Handle the error here
    }
  };
  const isAddressValid = (address: string): boolean => {
    return /^(0x)?[0-9a-fA-F]{40}$/.test(address);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null); // Clear error when input changes
    setContractAddress(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAddressValid(contractAddress)) {
      setError("Please enter a valid Ethereum address.");
      return;
    }
    router.push(`/audits/${encodeURIComponent(contractAddress)}`);
    setContractAddress("");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if(activeaudit){
        queryAuditStatus(contractAddress);
      }
    }, 5000); // Adjust the interval as needed (e.g., 5000ms = 5 seconds)

    return () => {
      clearInterval(interval);
    };
  }, [contractAddress]);

  return (
    <div className="w-[100%] flex flex-col gap-6">
      <div className="flex flex-col items-center justify-between w-full gap-5 md:flex-row md:gap-6">
        <form
          onSubmit={handleSubmit}
          className="z-[1] w-full md:min-w-[800px] bg-[#00000041] flex flex-col items-center justify-center gap-4 border border-[#737373] p-5 pt-6 rounded-lg relative"
        >
          <h1 className="w-full text-success font-[600]">Enter Contract Address</h1>
          <Input
            type="text"
            label="Contract Address"
            value={contractAddress}
            onChange={handleInputChange}
            errorMessage={error || ""}
          />
          <div className="flex justify-start w-full">
            <Button type="submit" className="bg-gradient-to-r from-[#141414] via-[#14141496] to-gray-700">
              Submit
            </Button>
          </div>
        </form>
        <GoToOtherType />
      </div>
      <AuditReport />
    </div>
  );
};

export default AddressAuditForm;
