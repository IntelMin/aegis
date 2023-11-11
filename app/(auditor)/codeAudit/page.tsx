
import React from "react";

import Title from "@/components/title";
import CodeAuditForm from "@/components/codeAuditForm";

type Props = {};

const AddressAudit = (props: Props) => {
  return (
    <div className="w-full h-full flex flex-col gap-4 bg-[#2121219f]">
      {/* <Title title="Code Auditor" icon /> */}
      <CodeAuditForm />
    </div>
  );
};

export default AddressAudit;
