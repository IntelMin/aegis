"use client";
import React from "react";
import ApexChart from "../pieChart";
import { Card } from "@nextui-org/react";

const TokenAuditReport = () => {
  return (
    <div className="p-4">
      <Card>
        <ApexChart />
      </Card>
    </div>
  );
};

export default TokenAuditReport;
