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
      <div className="flex items-center justify-between w-full">
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#000000",
            backgroundImage:
              "linear-gradient(220deg, rgb(87, 87, 87) 0%, rgba(9, 9, 9, 0) 60%, rgba(9, 9, 9, 0) 100%)",
          }}
          className="z-[1] w-full md:w-[500px] bg-[#2a29296d] flex flex-col items-center justify-center gap-4 border border-[#737373] p-5 pt-6 rounded-lg relative"
        >
          <h1 className="w-full">Enter Contract Address</h1>
          <Input
            type="text"
            label="Contract Address"
            value={contractAddress}
            onChange={handleInputChange}
          />
          <div className="w-full flex justify-start">
            <Button type="submit" className="bg-[#323232] hover:bg-primary-300">
              Submit
            </Button>
          </div>
        </form>
        <p
          style={{
            backgroundColor: "#000000",
            backgroundImage:
              "linear-gradient(220deg, rgb(87, 87, 87) 0%, rgba(9, 9, 9, 0) 60%, rgba(9, 9, 9, 0) 100%)",
          }}
          className="text-[30px] text-[#9bdc9b] bg-[#000000] rounded-lg px-4"
        >
          OR
        </p>
        <GoToOtherType />
      </div>
      <AuditReport />
    </div>
  );
};

export default AddressAuditForm;
