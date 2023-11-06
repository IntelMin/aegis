"use client";

import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import AuditReport from "../auditReport";
import GoToOtherType from "../GoToOtherType";

type Props = {};

const AddressAuditForm = (props: Props) => {
  const [contractAddress, setContractAddress] = useState<string>("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContractAddress(event.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(contractAddress);
    setContractAddress("");
  };
  return (
    <div className="w-[100%] flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-center justify-between w-full">
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
          />
          <div className="w-full flex justify-start">
            <Button type="submit" className="bg-[#1ac260a5]">
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
