import Title from "@/components/title";
import React from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import SecurityScore from "./SecurityScore";
import AuditHistory from "./AuditHistory";

type Props = {};

const CodeSecurity = (props: Props) => {
  return (
    <div className="bg-[#5b5b5b4d] p-4 rounded-lg mt-3">
      <div className="ml-2 flex gap-3 items-center">
        <Title title="Code Security" icon={false} /> <span className="mt-1"><BiSolidDownArrow /></span>
      </div>
      <div className="bg-[#1a1a1abb] p-4 rounded-lg mt-3">
        <div className="flex flex-col gap-2 md:flex-row justify-start md:justify-between md:items-center">
          <Title title="Code Audit History" subHeader icon={false} />
          <p className="text-[14px] text-success-400 font-semibold">
            Last Audit: 8th Oct, 2023
          </p>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <h1 className="font-[800] text-[#e3e1e1] w-fit flex gap-3 text-[15px]">
            Token - AI Auditor
          </h1>
          <div>
            <button type="button" className="bg-[#1f611f] px-[6px] py-1 font-semibold text-[14px] rounded-lg">View PDF</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-3">
            <AuditHistory />
            <SecurityScore />
        </div>
      </div>
    </div>
  );
};

export default CodeSecurity;
