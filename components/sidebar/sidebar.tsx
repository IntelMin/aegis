"use client";

import { usePathname } from "next/navigation";

import { Button, useDisclosure } from "@nextui-org/react";
import { MdOutlineSecurity } from "react-icons/md";
import { BiWalletAlt } from "react-icons/bi";
import { GiStabbedNote } from "react-icons/gi";
import { GoVerified } from "react-icons/go";
import { TbTargetArrow } from "react-icons/tb";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { useSidebarContext } from "../layout/layout-context";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { Sidebar } from "./sidebar.styles";
import AuditTypeModal from "../modal/auditTypeModal";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";

export const SidebarWrapper = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  const handleOpen = () => {
    onOpen();
  };
  return (
    <aside className="h-screen z-[202] sticky top-0 bg-red-500">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        }, )}
      >
        <div className={Sidebar.Header()}>
          <h1 className="font-bold text-[20px] tracking-[10px]">LOGO</h1>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Leaderboards">
              <SidebarItem
                isActive={pathname === "/security"}
                title="Security Score"
                icon={
                  <MdOutlineSecurity className="text-[#969696] text-[22px] ml-[2px]" />
                }
                href="security"
              />
              <SidebarItem
                isActive={pathname === "/bugBounty"}
                title="Bug Bounty"
                icon={
                  <TbTargetArrow className="text-[#969696] text-[22px] ml-[2px]" />
                }
                href="bugBounty"
              />
              <SidebarItem
                isActive={pathname === "/verifiedteams"}
                title="Verified Teams"
                icon={
                  <GoVerified className="text-[#969696] text-[22px] ml-[2px]" />
                }
                href="verifiedteams"
              />
            </SidebarMenu>

            <SidebarMenu title="Diligence Tools">
              <SidebarItem
                isActive={pathname === "/audit"}
                title="Exchange Audit"
                icon={
                  <GiStabbedNote className="text-[#969696] text-[22px] ml-[2px]" />
                }
                href="audit"
              />

              <SidebarItem
                isActive={pathname === "/smartmoney"}
                title="Smart Money"
                icon={
                  <BiWalletAlt className="text-[#969696] text-[22px] ml-[2px]" />
                }
                href="smartmoney"
              />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>
            <Button
              className="bg-primary-200 uppercase font-semibold w-[90%]"
              onPress={() => {
                handleOpen();
                setCollapsed();
              }}
            >
              Request Audit
            </Button>
            <AuditTypeModal isOpen={isOpen} onClose={onClose} />
            {/* <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip> */}
          </div>
        </div>
      </div>
    </aside>
  );
};
