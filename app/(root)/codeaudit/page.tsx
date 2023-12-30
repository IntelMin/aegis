"use client"
import React from "react";
import CodeAuditEditor from "@/components/code-audit-editor";
import { Button } from "@nextui-org/react";
import {toast } from "react-hot-toast";  
import ScaleLoader from "react-spinners/ScaleLoader";
const CodeAudit = () => {
  const [ContractCode, setContractCode] = React.useState<string>("");
  const [findings, setFindings] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ContractCode === "") {
      toast.error("Please add valid contract code");
      return;
    }

    setLoading(true);

    try {
      const data = {
        type: "code",
        sourcecode: ContractCode,
      };

      const response = await fetch("/api/code", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setFindings(result.findings);
    } catch (error) {
      console.error("Error during code audit:", error);
      toast.error("An error occurred during code audit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
    <div className="px-20 py-24">
      <div className="w-full flex-cols justify-center items-center text-center space-y-6">
      <div className="space-y-3">
      <h1 className="text-2xl text-white text-semibold">Code Audit   </h1>
      <h1 className="text-md text-neutral-300">Paste token contract code below to audit code.</h1>  
      </div>

      <Button type="submit" className=" text-white text-sm px-28 py-2 bg-[#0E76FD] space-y-4 ">
        Audit your Code {loading && (<div
        className="loader"
        >
          </div>)}
      </Button>
      </div>
      <CodeAuditEditor ContractCode={ContractCode} SetContractCode={setContractCode} handleSubmit={handleSubmit} findings={findings} />
    </div>
    </form>
    </>
  );
};

export default CodeAudit;
