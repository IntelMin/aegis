"use client";

import { Button, Textarea } from "@nextui-org/react";
import React, { useState } from "react";

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
    <div className="w-[100%] h-full flex flex-col ">
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#000000",
          backgroundImage:
            "linear-gradient(40deg, rgba(0,0,0,1) 0%, rgba(106,103,103,1) 90%, rgba(181,181,181,0.8225884103641457) 100%)",
        }}
        className="z-[1] w-full md:w-[500px] bg-[#2a29296d] flex flex-col items-center justify-center gap-4 border border-[#737373] p-5 pt-6 rounded-lg relative"
      >
        <h1 className="w-full">Enter your code here</h1>
        <Textarea
          type="text"
          label="Contract Code"
          value={contractCode}
          onChange={handleInputChange}
          minRows={8}
        />
        <div className="w-full flex justify-start">
          <Button type="submit" className="bg-[#323232] hover:bg-primary-300">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CodeAuditForm;
