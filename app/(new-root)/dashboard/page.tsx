import React from "react";
import DashboardDataTable from "@/components/Dashboard/dashboard-data-table";
import DropdownFilter from "@/components/Dashboard/drop-down-filter";
import TokenMarquee from "@/components/token-marquee";

const Dashboard = () => {
  return (
    <div className="px-10 py-10">
      <div className="grid grid-cols-1 gap-6">
        <TokenMarquee />
      </div>
      <DropdownFilter />
      <DashboardDataTable />
    </div>
  );
};

export default Dashboard;
