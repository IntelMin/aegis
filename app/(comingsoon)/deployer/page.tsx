import React from "react";
import Deployer from "@/components/deployer/index";
import { NavbarWrapper } from "@/components/navbar/navbar";
import Title from "@/components/title";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type Props = {};

const DeployerPage = (props: Props) => {
  return (
    <NavbarWrapper pageTitle={<div></div>}>
      <div className="py-4 px-5 w-full h-full flex flex-col gap-4">
        <Title title="Deployer" endContent={<ConnectButton/>} />
        <Deployer />
      </div>
    </NavbarWrapper>
  );
};

export default DeployerPage;
