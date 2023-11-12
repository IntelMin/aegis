"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BsArrowLeft } from "react-icons/bs";
import TokenHeader from "@/components/projects/tokenDetail/tokenHeader";
import TokenDetail from "@/components/projects/tokenDetail/TokenDetail";
import AuditDetail from "@/components/projects/tokenDetail/AuditDetails";
import CodeSecurity from "@/components/projects/tokenDetail/codeSecurity";

type Props = {};

type ProjectData = {
  // Define the properties and types that match the expected data
};

const ProjectPage = (props: Props) => {
  const params = useParams();
  const contract_address = params.id;
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  useEffect(() => {
    if (contract_address) {
      const fetchData = async () => {
        try {
          const request = {
            type: "info",
            address: contract_address,
          };
          const response = await fetch("/api/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setProjectData(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [contract_address]);

  if (!projectData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full h-full gap-4 px-5 py-4">
      <Link
        href={"/projects"}
        className="flex items-center gap-4 font-[600] mb-6"
      >
        <BsArrowLeft className="font-[600]" />
        Go back
      </Link>
      <TokenHeader {...projectData} />
      <AuditDetail {...projectData} />
      <CodeSecurity {...projectData} />
      {/* <TokenDetail /> */}
    </div>
  );
};

export default ProjectPage;
