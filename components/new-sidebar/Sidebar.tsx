"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navArr } from "./side-items";
import SidebarFooter from "./sidebar-footer";
import SidebarOpenbtn from "./sidebar-openbtn";
import SidebarItems from "./sidebar-items";
import SidebarHeader from "./sidebar-header";
import SidebarSectionTitle from "./sidebar-section-title";

type Props = {};

const Sidebar = (props: Props) => {
  const [open, setOpen] = useState(1);
  
  const divvars = {
    width: open === 2 ? "250px" : "100px",
    transition: { duration: 0.4, type: "spring" },
  };
  return (
    <AnimatePresence initial={false}>
      <motion.div
        animate={divvars}
        className={`${
          open === 2 ? "w-[250px] px-6 " : "w-[100px]"
        } h-screen flex flex-col justify-between items-center border-r border-zinc-800 py-4 sticky top-0 left-0`}
      >
        <div>
          <SidebarHeader open={open} />
          <div>
            <div className="flex flex-col gap-3 mt-12">
              {navArr?.map((ele) => (
                <div key={ele?.title} className="flex flex-col gap-3 mt-3">
                  <SidebarSectionTitle ele={ele} open={open} />
                  <div className="flex flex-col gap-3">
                    {ele?.children?.map((item) => (
                      <SidebarItems key={item?.name} item={item} open={open} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <SidebarOpenbtn open={open} setOpen={setOpen} />
        <SidebarFooter open={open} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Sidebar;
