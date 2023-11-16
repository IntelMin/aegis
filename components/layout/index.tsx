"use client";

import React from "react";
import { Toaster } from 'sonner';
import { useLockedBody } from "../hooks/useBodyLock";
import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext } from "./layout-context";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };


  return (
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}
    >
      <section className="flex bg-black">
        <Toaster richColors />
        <SidebarWrapper />
          {children}
      </section>
    </SidebarContext.Provider>
  );
};
