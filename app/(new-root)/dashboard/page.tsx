import DashboardDataTable from "@/components/Dashboard/dashboard-data-table";
import TokenMarquee from "@/components/token-marquee";
import React from "react";


const Dashboard = () => {
  return (
    <div className="px-10">
      <TokenMarquee />
      
      {/* -- MIHIR ADD YOUR COMPONENT FOR THE DASHBOARD TABLE HERE -- */}
      <DashboardDataTable />
    </div>
  );
};

export default Dashboard;
