import React from "react";
import Navbar from "@/components/nav-monitoring/navbar-monitoring";
import Sidebar from "@/components/new-sidebar/Sidebar";
const NewLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full relative">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default NewLayout;
