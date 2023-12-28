import Image from "next/image";
import React from "react";
import NavHeader from "./nav-header";

type Props = {};

const NavbarMonitoring = (props: Props) => {
  return (
    <div className="sticky top-0 bg-black">
      <NavHeader />
    </div>
  );
};

export default NavbarMonitoring;
