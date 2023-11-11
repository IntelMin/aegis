"use client";

import { Button, Textarea } from "@nextui-org/react";
import React, { useState } from "react";
import AuditReport from "../auditReport";
import GoToOtherType from "../GoToOtherType";
import Editor from "@monaco-editor/react";
import { Card, Skeleton } from "@nextui-org/react";
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

      const response = await fetch("/api/audit", {
        method: "POST",
        body: JSON.stringify(data),
      });

      return response.json();
    };
    postData().then((data) => {
      alert(data.message);
    });
  };

  return (
    <div className="flex flex-col w-full h-screen bg-black">
      <div className="flex flex-col items-center justify-between w-full h-full md:flex-row md:gap-5">
        <div className="z-[1] w-full md:min-w-[800px] flex flex-col items-center justify-center p-6 rounded-lg relative h-full">
          <h1 className="w-full text-success font-[600] mb-4">Contract code</h1>
          <Editor
            height="100%"
            theme="vs-dark"
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
            onChange={(newValue: any) => setContractCode(newValue)}
          />
        </div>
        {/* <GoToOtherType
          iconName="address"
          pathName="addressAudit"
          btnName="Address"
        /> */}
        <div className="z-[1] w-fullflex flex-col items-center justify-center pt-4 rounded-lg relative h-full">
          <h1 className="w-full text-success font-[600] mb-4">Findings</h1>

          <div className="w-full mb-5 border bg-[#14141480] border-[#737373] p-5 pt-5 rounded-lg">
            <div>
              <Card className="w-full p-4 mb-5 space-y-5" radius="lg">
                <Skeleton className="rounded-lg">
                  <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div className="space-y-3">
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="w-3/5 h-3 rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-4/5 rounded-lg">
                    <div className="w-4/5 h-3 rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-2/5 rounded-lg">
                    <div className="w-2/5 h-3 rounded-lg bg-default-300"></div>
                  </Skeleton>
                </div>
              </Card>
            </div>
            <Button
              onClick={handleSubmit}
              type="submit"
              className="bg-[#1ac260a5] w-full"
            >
              Audit your code
            </Button>
          </div>

          <AuditReport />
        </div>
      </div>
    </div>
  );
};

export default CodeAuditForm;
