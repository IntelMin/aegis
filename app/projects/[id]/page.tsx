import Link from "next/link";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import TokenHeader from "@/components/projects/tokenDetail/tokenHeader";
import TokenDetail from "@/components/projects/tokenDetail/TokenDetail";

type Props = {};

const ProjectPage = (props: Props) => {
  return (
    <div className="py-4 px-5 w-full h-full flex flex-col gap-4 bg-[#2121219f]">
      <Link
        href={"/projects"}
        className="flex items-center gap-4 font-[600] mb-6"
      >
        <BsArrowLeft className="font-[600]" />
        Go back
      </Link>
      <TokenHeader />
      <TokenDetail />
    </div>
  );
};

export default ProjectPage;
