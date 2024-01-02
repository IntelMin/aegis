import React from "react";
import Navbar from "@/components/navbar/navbar-monitoring";
import Sidebar from "@/components/sidebar/sidebar";
const NewLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="relative w-full">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default NewLayout;
