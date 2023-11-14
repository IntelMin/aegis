import Link from "next/link";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import TokenHeader from "@/components/projects/tokenDetail/tokenHeader";
import TokenDetail from "@/components/projects/tokenDetail/TokenDetail";
import AuditDetail from "@/components/projects/tokenDetail/AuditDetails";

type Props = {};

const ProjectPage = (props: Props) => {
  return (
    <div className="flex flex-col w-full h-full gap-4 px-5 py-4">
      <Link
        href={"/projects"}
        className="flex items-center gap-4 font-[600] mb-6"
      >
        <BsArrowLeft className="font-[600]" />
        Go back
      </Link>
      <TokenHeader />
      {/* <AuditDetail /> */}
      <TokenDetail />

      
    </div>
  );
};

export default ProjectPage;