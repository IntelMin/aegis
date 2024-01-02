"use client";

import React from "react";
import CodeAuditEditor from "@/components/code-audit-editor";
import Findings from "@/components/findings";
import { Button } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import ScaleLoader from "react-spinners/ScaleLoader";

const CodeAudit = () => {
  const [activeComponent, setActiveComponent] = React.useState<string>("contractCode");
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

  const handleButtonClick = (component: string) => {
    setActiveComponent(component);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="px-2 md:mt-2 mt-4">
        <div className="md:px-20 md:py-24 space-y-8">
          <div className="w-full flex-cols md:flex justify-center md:justify-between items-center text-center space-y-8 md:px-3">
            <div className="space-y-3 text-start">
              <h1 className="text-2xl text-white text-semibold">Code Audit</h1>
              <h1 className="text-md text-neutral-300">Paste token contract code below to audit code.</h1>
            </div>

            <Button
              type="submit"
              onClick={() => handleButtonClick("contractCode")}
              className={`text-white text-sm md:px-28 w-full md:w-[387px] py-2 bg-[#0E76FD] md:space-y-4 ${
                activeComponent === "contractCode" ? "active" : ""
              }`}
            >
              Audit your Code {loading && <ScaleLoader />}
            </Button>
          </div>
          <div className="flex space-x-2 space-y-0 md:hidden ">
            <Button
              onClick={() => handleButtonClick("contractCode")}
              className={`text-neutral-200 text-md font-semibold md:px-28 w-full p-2 bg-zinc-900 space-y-4 ${
                activeComponent === "contractCode" ? "active" : "opacity-50 cursor-not-allowed"
              }`}
            >
              Contract Code
            </Button>
            <Button
              onClick={() => handleButtonClick("findings")}
              className={`text-neutral-200 text-md space-x-2 font-semibold md:px-28 w-full p-2 bg-zinc-900 space-y-4 ${
                activeComponent === "findings" ? "active" : "opacity-50 cursor-not-allowed"
              }`}
            >
              Findings 
              <p className="animate-pulse">🟢</p>
            </Button>
          </div>
          {activeComponent === "contractCode" && (
            <CodeAuditEditor ContractCode={ContractCode} SetContractCode={setContractCode} handleSubmit={handleSubmit} findings={findings} />
          )}
          {activeComponent === "findings" && <Findings findings={findings} />}
        </div>
      </form>
    </>
  );
};

export default CodeAudit;
