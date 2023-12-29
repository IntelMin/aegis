"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import FunctionReport from "@/components/audit-detail/function-report";
import OverViewReport from "@/components/audit-detail/overview-report";
import { AUDIT_STATUS_RETURN_CODE } from "@/server/api/statusCodes";
import CodeViewer from "@/components/projects/tokenDetail/codeViewer";
import InheritanceGraph from "@/components/projects/tokenDetail/inheritanceGraph";

type Props = {
  params: {
    id: string;
  };
};

type Finding = {
  severity: "LOW" | "MEDIUM" | "HIGH";
  title: string;
  mitigation: string;
};

export type DataProps = {
  key: number;
  type: string | null;
  name: string | null;
  mutating: string | null;
  spec: string | null;
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

const DetailedPage = ({ params }: Props) => {
  const tabArr = ["Overview", "Code", "Functions", "Dependency"];
  const contractAddress = params.id;
  const [tab, setTab] = useState("Overview");

  const [infoData, setInfoData] = useState<ProjectData | null>(null);
  const [codeData, setCodeData] = useState<CodeData | null>(null);
  const [functionTableData, setFunctionTableData] = useState<DataProps[] | null>(
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
      <div className="flex items-center justify-center w-full h-screen text-white">
        <div className="text-lg font-bold text-center">
          <p>Loading...</p>
          <p className="mt-2">
            {status}: {getStatusText(status)}
          </p>
        </div>
      </div>
    );
  }

  const renderComponent = () => {
    switch (tab) {
      case "Overview":
        return <OverViewReport />;
      case "Code":
        return (
          <div className="p-6">
            <div className="border border-zinc-800 p-4">
              <CodeViewer {...(codeData as any)} />
            </div>
          </div>
        );
      case "Functions":
        return <FunctionReport data={functionTableData} />;
      case "Dependency":
        return (
          <div>
            <InheritanceGraph data={dependencyData} />
          </div>
        );
      default:
        break;
    }
  };
  return (
    <div className="w-full flex flex-col text-white">
      <div className="flex justify-center items-center auditReportDetailedBg w-full h-[240px] relative">
        {/* Token Name */}
        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center gap-3">
            <Image
              src="/aaveIcon.svg"
              alt="token-icon"
              width={40}
              height={40}
            />
            <h3 className="text-neutral-50 text-[32px]">Aave</h3>
            <p className="text-neutral-300 text-[24px] font-[300]">$AAVE</p>
          </div>
          <p className="text-blue-400 text-[16px] font-[300] px-4 py-2">
            {params?.id}
          </p>
        </div>
        {/* Tabs */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-12">
          {tabArr?.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`${
                tab === item
                  ? "text-neutral-50 border-b-[4px] border-blue-600"
                  : "text-neutral-500 border-b-[4px] border-transparent"
              } text-[18px] transition-all ease-in duration-150 px-1 py-2`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {renderComponent()}
    </div>
  );
};

export default DetailedPage;
