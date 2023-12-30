"use client";

import React, { useState } from "react";
import AuditReport from "../auditReport";
import GoToOtherType from "../GoToOtherType";
import Editor from "@monaco-editor/react";
import { Button, Card, Skeleton } from "@nextui-org/react";
import { toast } from "sonner";

type Props = {};

const CodeAuditForm = (props: Props) => {
  const [contractCode, setContractCode] = useState<string>("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContractCode(event.target.value);
  };
  const handleSubmit = (e: any) => {
    console.log(contractCode);

    if (contractCode === "") {
      toast.error("Please add valid contract code");
      return;
    }

    // setContractCode("");
    const postData = async () => {
      const data = {
        type: "code",
        sourcecode: contractCode,
      };

      const response = await fetch("/api/code", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const Tempdata = await response.json()

      return Tempdata.findings;
    };
    postData().then((data:any) => {
      // alert(data.message);
      console.log(data)
    });
  };

  return (
    <>
      <div className="flex h-screen bg-transparent">
        {/* <!-- Editor Container --> */}
        <div className="flex flex-col flex-1">
          <div className="p-4 text-white">
            <h1 className="text-xl font-bold">Contract code</h1>
          </div>
          {/* <!-- Editor Area --> */}
          <div className="flex-1 p-4 bg-[#141414]">
            <Editor
              height="calc(100%)"
              theme="vs-dark"
              language="solidity"
              defaultLanguage="javascript"
              defaultValue=""
              options={{
                minimap: {
                  enabled: true,
                },
                fontSize: 14,
                cursorStyle: "block",
                wordWrap: "on",
              }}
              onChange={(newValue: any) => setContractCode(newValue)}
            />
          </div>
        </div>

        {/* <!-- Findings and Reports Container --> */}
        <div className="flex flex-col w-1/3">
          {/* <!-- Findings Area --> */}
          <div className="flex flex-col flex-1 p-4">
            {/* <!-- Header for Findings --> */}
            <div className="mb-4 text-white">
              <h1 className="text-xl font-bold">Findings</h1>
            </div>
            <Button
              onClick={handleSubmit}
              className="p-2 mb-4 text-white bg-gradient-to-r from-[#141414] via-[#14141496] to-gray-700 rounded"
            >
              Audit your code
            </Button>
            {/* <!-- Placeholder for Findings Content --> */}
            <div className="flex-1 bg-[#141414]">
              <div className="max-w-[300px] p-5 w-full flex items-center gap-3">
                <div>
                  <Skeleton className="flex w-12 h-12 rounded-full" />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <Skeleton className="w-3/5 h-3 rounded-lg" />
                  <Skeleton className="w-4/5 h-3 rounded-lg" />
                </div>
              </div>
            </div>
            {/* <!-- Audit Button --> */}
          </div>
        </div>
      </div>

      <div className="p-4">
        <AuditReport />
      </div>
    </>
  );
};

export default CodeAuditForm;
