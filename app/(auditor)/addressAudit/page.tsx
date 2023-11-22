import AddressAuditForm from "@/components/addressAuditForm";
import { NavbarWrapper } from "@/components/navbar/navbar";
import Title from "@/components/title";
import React from "react";
import { LuCoins, LuRocket } from "react-icons/lu";

type Props = {};

const AddressAudit = (props: Props) => {
  return (
    <NavbarWrapper pageTitle={<div></div>}>
      <div className="py-4 px-5 w-full h-full flex flex-col gap-4 bg-[#2121219f]">
        {/* <Title title="Address Auditor" icon /> */}
        <h1 className="text-[20px] font-semibold text-[#e3e1e1] w-fit flex items-center gap-3">
        <LuCoins className="text-[#c5c5c5] text-[22px] ml-[2px]" />
            Token Auditor
            </h1>
        <AddressAuditForm />
      </div>
    </NavbarWrapper>
  );
};

export default AddressAudit;
