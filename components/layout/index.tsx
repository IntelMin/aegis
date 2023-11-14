"use client";

import React, {useState} from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext, PageTitleContext } from "./layout-context";
import { Toaster } from 'sonner'

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

  const [pageTitle, setPageTitle] = useState(<div></div>);

  return (
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}
    >
      <section className="flex">
        <Toaster richColors />
        <SidebarWrapper />
        {/* <NavbarWrapper pageTitle={pageTitle}> */}
          {children}
          {/* {React.cloneElement(children, { setPageName })} */}
        {/* </NavbarWrapper> */}
      </section>
    </SidebarContext.Provider>
  );
};
