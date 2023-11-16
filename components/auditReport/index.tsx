import React from "react";
import Title from "../title";
import { AiOutlineLock } from "react-icons/ai";

type Props = {};


const AuditReport = (props: Props) => {
  function shortenText(text: string) {
    if (text.length <= 250) {
      return text;
    } else {
      return text.slice(0, 250) + "...";
    }
  }
  const originalAudit =
  "A comprehensive audit report that includes a detailed analysis of the code, a list of all the vulnerabilities found, and recommendations on how to fix them.";

  return (
    <div
      className="border border-[#737373] p-5 pt-6 rounded-lg"
      style={{
        overflow: "hidden",
        backdropFilter: "blur(30px)",
        boxShadow: "0px -10px 15px rgba(0, 0, 0, 0.1) inset",
        background: `linear-gradient(to top, #414141 0%, #000000 70%);`,
      }}
    >
      <div className="flex items-center justify-between">
        <Title title="AI Audit Report" icon iconName="report" />
      </div>
      <div className="py-4">
        <p>{shortenText(originalAudit)}</p>
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-3">
        <p className="font-[500] uppercase text-[12px] md:text-[22px] tracking-[5px] text-center">
          Unlock Full Audit Report with Premium.
        </p>
        <button
          type="button"
          className="flex gap-3 items-center border p-2 rounded-lg font-[400] text-[16px] md:text-[20px] uppercase"
        >
          <AiOutlineLock /> Locked
        </button>
      </div>
    </div>
  );
};

export default AuditReport;
