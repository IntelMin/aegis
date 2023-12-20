"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import TokenHeader from "@/components/projects/tokenDetail/tokenHeader";
import CodeSecurity from "@/components/projects/tokenDetail/codeSecurity";
import TokenMarkdown from "@/components/projects/tokenDetail/tokenMarkdown";
import InheritanceGraph from "@/components/projects/tokenDetail/inheritanceGraph";
import CodeViewer from "@/components/projects/tokenDetail/codeViewer";
import AuditFunctionTable, { DataProps } from "@/components/auditFunctionTable";
import AuditDetail from "@/components/projects/tokenDetail/AuditDetails";
import { AUDIT_STATUS_RETURN_CODE } from "@/server/api/statusCodes";

type Finding = {
  severity: "LOW" | "MEDIUM" | "HIGH";
  title: string;
  mitigation: string;
};

type ProjectData = {
  name: string;
  symbol: string;
  address: string;
  circulating_market_cap: string;
  decimals: string;
  exchange_rate: string;
  holders: string;
  icon_url: string;
  total_supply: string;
  type: string;
};

type CodeData = {
  status?: number;
  tree?: string[] | null;
  code: string | null;
  findings: Finding[] | null;
};

// TODO: Move this to a utils file
const getStatusText = (statusCode: number) => {
  switch (statusCode) {
    case AUDIT_STATUS_RETURN_CODE.notRequested:
      return "Audit not requested";
    case AUDIT_STATUS_RETURN_CODE.pending:
      return "Audit pending";
    case AUDIT_STATUS_RETURN_CODE.partial:
      return "Audit partially complete";
    case AUDIT_STATUS_RETURN_CODE.complete:
      return "Audit complete";
    case AUDIT_STATUS_RETURN_CODE.errorFetchingDb:
    default:
      return "An error occurred, please try again later or contact support";
  }
};

const ProjectPage = () => {
  const params = useParams();

  const contractAddress = params.id;

  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");

  const [infoData, setInfoData] = useState<ProjectData | null>(null);
  const [codeData, setCodeData] = useState<CodeData | null>(null);
  const [functionData, setFunctionData] = useState(null);
  const [functionTableData, setFunctionTableData] = useState<DataProps | null>(
    null
  );
  const [dependencyData, setDependencyData] = useState<any>([null]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(AUDIT_STATUS_RETURN_CODE.notRequested);

  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getAuditResults = async () => {
      try {
        const fetchData = async () => {
          try {
            const response = await fetch("/api/token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "audit", address: contractAddress }),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            console.log(responseData);

            // setFunctionTableData(responseData.findings?.table?.slice(1));
            setInfoData(responseData);
            setCodeData(responseData.code);
            setFunctionTableData(responseData.functions.tableRows);
            setDependencyData(responseData.dependencies);

            // if (codeData.status === AUDIT_STATUS_RETURN_CODE.complete) {
            //   if (timer.current) clearInterval(timer.current);
            // }
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      } catch (error) {
        console.error("Error polling data:", error);
      }
    };

    const requestAudit = async () => {
      try {
        const response = await fetch("/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "audit_request",
            address: contractAddress,
          }),
        });
        // check if response is 200
        if (!response.ok) {
          console.error("Error requesting audit:", response);
          if (timer.current) clearInterval(timer.current);
        }
      } catch (error) {
        console.error("Error requesting audit:", error);
      }
    };

    const pollStatus = async () => {
      if (timer.current) clearInterval(timer.current);

      try {
        const response = await fetch("/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "audit_status",
            address: contractAddress,
          }),
        });
        const auditData = await response.json();

        setStatus(auditData.status);
        switch (auditData.status) {
          case AUDIT_STATUS_RETURN_CODE.notRequested:
            requestAudit();
          // Fall through to start polling
          case AUDIT_STATUS_RETURN_CODE.pending:
          case AUDIT_STATUS_RETURN_CODE.partial:
            setStatus(auditData.status);
            timer.current = setInterval(pollStatus, 5000);
            break;
          case AUDIT_STATUS_RETURN_CODE.complete:
            if (timer.current) clearInterval(timer.current);
            getAuditResults();
            break;
        }
      } catch (error) {
        console.error("Error polling data:", error);
        setStatus(4);
      }
    };

    if (contractAddress) {
      pollStatus();
    }

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [contractAddress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="text-lg font-bold text-center">
          <p>Loading...</p>
          <p className="mt-2">
            {status}: {getStatusText(status)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-5">
      <div className="relative flex flex-col w-full h-full gap-4 px-5 py-4 pt-0 overflow-x-hidden">
        <div className="flex items-center">
          <TokenHeader {...infoData} />
          <p className="w-full text-right">
            {codeData?.status === AUDIT_STATUS_RETURN_CODE.pending &&
              "Audit request is in pending list"}

            {codeData?.status === AUDIT_STATUS_RETURN_CODE.partial &&
              "Audit is being processed"}

            {codeData?.status === AUDIT_STATUS_RETURN_CODE.complete &&
              "Audit is complete"}
          </p>
        </div>
        <Tabs
          aria-label="Sections"
          color="success"
          variant="bordered"
          className="flex items-center justify-center w-full gap-4 md:py-4 md:px-5"
        >
          <Tab key="overview" title="Overview">
            <AuditDetail {...infoData} />
            {/* <CodeSecurity {...infoData} /> */}
          </Tab>
          <Tab key="code" title="Code">
            <CodeViewer {...(codeData as any)} />
          </Tab>
          <Tab key="functions" title="Functions">
            {/* <TokenMarkdown markdown={functionData} /> */}
            <AuditFunctionTable data={functionTableData} />
          </Tab>
          <Tab key="dependencies" title="Dependency">
            <Card>
              <InheritanceGraph data={dependencyData} />
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectPage;
