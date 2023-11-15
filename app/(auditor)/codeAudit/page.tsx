import React, { useState } from "react";

import Title from "@/components/title";
import CodeAuditForm from "@/components/codeAuditForm";
import { NavbarWrapper } from "@/components/navbar/navbar";

type Props = {};

const AddressAudit = (props: Props) => {
  return (
    <NavbarWrapper pageTitle={<div></div>}>
      <div className="w-full h-full flex flex-col gap-4 bg-[#2121219f]">
        {/* <Title title="Code Auditor" icon /> */}
        <CodeAuditForm />
      </div>
    </NavbarWrapper>
  );
};

export default AddressAudit;
