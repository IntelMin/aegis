"use client";

import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import Findings from "../findings";

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
      <div className="flex bg-transparent w-full">
        {/* <!-- Editor Container --> */}
        <div className="flex flex-col flex-1  w-full justify-center items-center ">
        <div className="text-white text-start w-full md:w-[928px] px-4">
          <h1 className="text-xl font-bold hidden md:block">Contract code</h1>
          </div>
          
          {/* <!-- Editor Area --> */}
          <div className="flex-1 md:p-2 bg-[#09090B] w-full min-h-screen md:w-[902px]">
            <Editor
              height="100%"
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
        <div className="hidden md:flex md:w-full w-0">
        <Findings findings={findings} />
        </div>
      </div>
    </>
  );
};

export default CodeAuditEditor;
