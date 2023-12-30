"use client";

import React, { useEffect, useState } from "react";
import AuditReport from "../auditReport";
import GoToOtherType from "../GoToOtherType";
import Editor from "@monaco-editor/react";
import { Button, Card, Skeleton } from "@nextui-org/react";
import { toast } from "sonner";

type Props = {
  ContractCode: string;
  SetContractCode: any;
  handleSubmit: any;
  findings:any;
};

const CodeAuditEditor = (props: Props) => {
  const [findings, setFindings] = useState<any>([]);
  useEffect(() => {
    if(props.findings?.findings?.length > 0){

      setFindings(props.findings?.findings);
    }
  }, [props.findings]);
  // const [contractCode, setContractCode] = useState<string>("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.SetContractCode(event.target.value);
  };

console.log(findings);
  return (
    <>
      <div className="flex bg-transparent md:px-12 md:py-8">
        {/* <!-- Editor Container --> */}
        <div className="flex flex-col flex-1 min-h-[667px] md:ml-10 justify-center items-center">
        <div className=" text-white text-start w-[400px] md:w-[928px] px-4">
        <h1 className="text-xl font-bold ">Contract code</h1>
          </div>
          {/* <!-- Editor Area --> */}
          <div className="flex-1 p-4 bg-[#09090B] w-[400px] md:w-[928px]">
            <Editor
              height="calc(100%)"
              theme="vs-dark"
              language="solidity"
              defaultLanguage="solidity"
              defaultValue=""
              options={{
                minimap: {
                  enabled: true,
                },
                fontSize: 14,
                cursorStyle: "block",
                wordWrap: "on",
              }}
              onChange={(newValue: any) => props.SetContractCode(newValue)}
            />
          </div>
        </div>
           <div className="flex flex-col flex-1 p-4 pb-6">
            {/* <!-- Header for Findings --> */}
            <div className="mb-6 text-white inline-flex space-x-2">
              <h1 className="text-xl font-bold">Findings</h1>
              <p className="animate-pulse mt-1">🟢</p>
            </div>
            {/* <!-- Placeholder for Findings Content --> */}
            <div className="flex-1  space-y-6 pr-5">                  
              {findings?.length > 0 ? (
                findings.map((finding: any) => (
                  <div className=" bg-zinc-900 min-h-[76px]  max-w-[300px] flex-cols items-center gap-3 space-y-6 text-white p-6">
                   <button className="rounded-full border-zinc-600 uppercase border-2 text-white text-sm  px-3 py-2 font-semibold">
                      <b className="animate-pulse mx-0.5">
                        {finding.severity === "INFO"
                          ? "🔵"
                          : finding.severity === "MEDIUM"
                          ? "🟠"
                          : finding.severity === "LOW"
                          ? "🟡"
                        : "🔴"}
                      </b>{" "}
                      {finding.severity}
                    </button>
                    <h1 className="text-lg font-semibold">{finding.vulnerability}</h1>
                  </div>
                ))
              ) : (
                <div className="h-full w-full flex justify-center items-center">
                  <h1 className="text-lg font-semibold text-white">No findings</h1>
                </div>
              )}
    
            </div>
        </div>

      </div>
    </>
  );
};

export default CodeAuditEditor;
