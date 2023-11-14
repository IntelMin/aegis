import AddressAuditForm from "@/components/addressAuditForm";
import { NavbarWrapper } from "@/components/navbar/navbar";
import Title from "@/components/title";
import React from "react";

type Props = {};

const AddressAudit = (props: Props) => {
  return (
    <NavbarWrapper pageTitle={<div></div>}>
      <div className="py-4 px-5 w-full h-full flex flex-col gap-4 bg-[#2121219f]">
        <Title title="Address Auditor" icon />
        <AddressAuditForm />
      </div>
    </NavbarWrapper>
  );
};

export default AddressAudit;
