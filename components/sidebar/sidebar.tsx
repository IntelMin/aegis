"use client";

import { redirect, usePathname } from "next/navigation";
import { GiStabbedNote, GiToken } from "react-icons/gi";
import { MdSecurity } from "react-icons/md";
import { LuTable, LuRocket } from "react-icons/lu";
import { FaCloudUploadAlt } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { useSidebarContext } from "../layout/layout-context";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { Sidebar } from "./sidebar.styles";
import { signOut } from "next-auth/react";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  const handleLogout = async () => {
    await signOut();
    redirect("/signin")
  }
  return (
    <aside className="h-screen z-[202] sticky top-0 bg-red-500">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <img
            className="h-[70px] mx-auto"
            src="/aegis-logo.png"
            alt="AEGIS AI"
          />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Dashboard"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />
            <SidebarItem
              title="Deployer"
              icon={
                <FaCloudUploadAlt className="text-[#c5c5c5] text-[22px] ml-[2px]" />
              }
              isActive={pathname === "/deployer"}
              href="/deployer"
            />
            <SidebarMenu title="Audits">
              <SidebarItem
                isActive={pathname === "/codeAudit"}
                title="Code Audit"
                icon={
                  <GiStabbedNote className="text-[#c5c5c5] text-[22px] ml-[2px]" />
                }
                href="/codeAudit"
              />

              <SidebarItem
                isActive={pathname === "/addressAudit"}
                title="Token Audit"
                icon={
                  <GiToken className="text-[#c5c5c5] text-[22px] ml-[2px]" />
                }
                href="/addressAudit"
              />
            </SidebarMenu>
            <SidebarMenu title="Leaderboards">
              <SidebarItem
                isActive={pathname === "/trending"}
                title="Trending"
                icon={
                  <LuRocket className="text-[#c5c5c5] text-[22px] ml-[2px]" />
                }
                href="/trending"
              />
              <SidebarItem
                isActive={pathname === "/liveMonitoring"}
                title="Live Monitoring"
                icon={
                  <LuTable className="text-[#c5c5c5] text-[22px] ml-[2px]" />
                }
                href="/liveMonitoring"
              />
              <SidebarItem
                isActive={pathname === "/security"}
                title="Security Score"
                icon={
                  <MdSecurity className="text-[#c5c5c5] text-[22px] ml-[2px]" />
                }
                href="/security"
              />
              <SidebarItem
                isActive={pathname === "/bugBounty"}
                title="Bug Bounty"
                icon={
                  <TbTargetArrow className="text-[#c5c5c5] text-[22px] ml-[2px]" />
                }
                href="/bugBounty"
              />
            </SidebarMenu>
            <button onClick={handleLogout}>Sign out</button>
          </div>
        </div>
      </div>
    </aside>
  );
};
