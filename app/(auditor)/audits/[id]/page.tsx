"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BsArrowLeft } from "react-icons/bs";
import { Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react";
import TokenHeader from "@/components/projects/tokenDetail/tokenHeader";
import TokenDetail from "@/components/projects/tokenDetail/TokenDetail";
import AuditDetail from "@/components/projects/tokenDetail/AuditDetails";
import CodeSecurity from "@/components/projects/tokenDetail/codeSecurity";
import TokenMarkdown from "@/components/projects/tokenDetail/tokenMarkdown";
import InheritanceGraph from "@/components/projects/tokenDetail/inheritanceGraph";

type Props = {};

type ProjectData = {
  // Define the properties and types that match the expected data
};

const ProjectPage = (props: Props) => {
  const params = useParams();
  const contract_address = params.id;
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");

  const [infoData, setInfoData] = useState<ProjectData | null>(null);
  const [codeData, setCodeData] = useState(null);
  const [functionData, setFunctionData] = useState(null);
  const [dependencyData, setDependencyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contract_address) {
      const fetchData = async () => {
        setLoading(true);

        try {
          const infoRequest = fetch("/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "info", address: contract_address }),
          });

          const codeRequest = fetch("/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "code", address: contract_address }),
          });

          const functionsRequest = fetch("/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "functions",
              address: contract_address,
            }),
          });

          const dependencyRequest = fetch("/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "dependencies",
              address: contract_address,
            }),
          });

          // Use Promise.all to wait for all fetch requests to complete
          const responses = await Promise.all([
            infoRequest,
            codeRequest,
            functionsRequest,
            dependencyRequest,
          ]);

          // Await the json() promise for each response
          const dataPromises = responses.map(async (response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Call json() only once
          });

          // Now wait for all the dataPromises to resolve
          const [infoData, codeData, functionData, dependencyData] = await Promise.all(
            dataPromises
          );

          // Update state for each tab's content
          setInfoData(infoData);
          setCodeData(codeData);
          setFunctionData(functionData.report);
          setDependencyData(dependencyData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [contract_address]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full h-full gap-4 px-5 py-4">
      {/* <Link
        href={"/projects"}
        className="flex items-center gap-4 font-[600] mb-6"
      >
        <BsArrowLeft className="font-[600]" />
        Go back
      </Link> */}
      <TokenHeader {...infoData} />
      <Tabs
        aria-label="Sections"
        color="success"
        variant="bordered"
        className="flex items-center justify-center w-full gap-4"
      >
        <Tab key="overview" title="Overview">
          {/* <AuditDetail {...infoData} /> */}
          <CodeSecurity {...infoData} />
        </Tab>
        <Tab key="code" title="Code">
          <Card>
            <CardBody>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="functions" title="Functions">
          <Card>
            <CardBody>
              <TokenMarkdown markdown={functionData} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="dependencies" title="Dependency">
          <Card>
            <CardBody>
                <InheritanceGraph data={dependencyData} />

              {/* <TokenMarkdown markdown={functionData} /> */}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      {/* <TokenDetail /> */}
    </div>
  );
};

export default ProjectPage;
