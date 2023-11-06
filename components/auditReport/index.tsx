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
    "The audit encompassed a detailed assessment of security vulnerabilities, code quality, documentation, and compliance. The findings revealed several security vulnerabilities, while the code exhibited satisfactory compliance with requirements. Code quality and documentation areas were also identified for improvement. This report presents recommendations for addressing the identified issues to enhance the contract code's overall robustness and reliability.";

  return (
    <div
      className="border bg-[#14141480] border-[#737373] p-5 pt-6 rounded-lg"
      style={{
        overflow: "hidden",
        backdropFilter: "blur(30px)",
        boxShadow: "0px -10px 15px rgba(0, 0, 0, 0.1) inset",
        background: `linear-gradient(to top, #37693a 0%, rgb(0 0 0 / 70%) 70%);`,
      }}
    >
      <div className="flex justify-between items-center">
        <Title title="AI Audit Report" icon iconName="report" />
      </div>
      <div className="py-4">
        <p>{shortenText(originalAudit)}</p>
      </div>
      <div className="w-full flex flex-col gap-3 items-center justify-center">
        <p className="font-[500] uppercase text-[16px] md:text-[24px] tracking-[5px] text-center">
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
