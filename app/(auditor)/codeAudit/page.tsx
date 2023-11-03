
import React from "react";

import Title from "@/components/title";
import CodeAuditForm from "@/components/codeAuditForm";

type Props = {};

const AddressAudit = (props: Props) => {
  return (
    <div className="py-4 px-5 w-full h-full flex flex-col gap-4">
      <Title title="Code Auditor" />
      <CodeAuditForm />
    </div>
  );
};

export default AddressAudit;
