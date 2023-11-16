import Title from "@/components/title";
import React from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import SecurityScore from "./SecurityScore";
import AuditHistory from "./AuditHistory";

type Props = {};

const CodeSecurity = (props: Props) => {
  return (
    <div className="mt-3 rounded-lg">
      <div className="flex flex-col justify-start gap-2 md:flex-row md:justify-between md:items-center">
        <Title title="Code Security" icon={false} /> 
        <p className="text-[14px] text-[#b0b0b0] font-semibold">
            Last Audit: 8th Oct, 2023
          </p>
      </div>
      <div className="mt-3">
        <div className="grid grid-cols-3 gap-6 mt-3">
            <AuditHistory />
            <SecurityScore />
        </div>
      </div>
    </div>
  );
};

export default CodeSecurity;
