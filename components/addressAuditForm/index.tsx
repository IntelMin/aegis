"use client";

import { Button, Input } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import AuditReport from "../auditReport";
import GoToOtherType from "../GoToOtherType";

const AddressAuditForm = () => {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(null);
    }

    setContractAddress(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("contractAddress", contractAddress);
    if (!/^(0x)?[0-9a-fA-F]{40}$/.test(contractAddress)) {
      setError("Please enter a valid Ethereum address.");
      return;
    }

    router.push(`/audits/${encodeURIComponent(contractAddress)}`);
  };

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
            placeholder="Contract Address"
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
      {/* <AuditReport /> */}
    </div>
  );
};

export default AddressAuditForm;
