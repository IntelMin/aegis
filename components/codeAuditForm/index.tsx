"use client";

import { Button, Textarea } from "@nextui-org/react";
import React, { useState } from "react";
import AuditReport from "../auditReport";
import GoToOtherType from "../GoToOtherType";

type Props = {};

const CodeAuditForm = (props: Props) => {
  const [contractCode, setContractCode] = useState<string>("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContractCode(event.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(contractCode);
    setContractCode("");
  };

  return (
    <div className="w-[100%] h-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-center justify-between w-full">
        <form
          onSubmit={handleSubmit}
          className="z-[1] w-full md:min-w-[800px] bg-[#00000041] flex flex-col items-center justify-center gap-4 border border-[#737373] p-5 pt-6 rounded-lg relative"
        >
          <h1 className="w-full text-success font-[600]">Enter your code here</h1>
          <Textarea
            type="text"
            label="Contract Code"
            value={contractCode}
            onChange={handleInputChange}
            minRows={8}
          />
          <div className="w-full flex justify-start">
            <Button type="submit" className="bg-[#1ac260a5]">
              Submit
            </Button>
          </div>
        </form>
        <GoToOtherType
          iconName="address"
          pathName="addressAudit"
          btnName="Address"
        />
      </div>
      <AuditReport />
    </div>
  );
};

export default CodeAuditForm;
