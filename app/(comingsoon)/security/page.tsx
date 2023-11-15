import SecurityLeaderBoard from "@/components/security/SecurityLeaderBoard";
import { NavbarWrapper } from "@/components/navbar/navbar";
import Title from "@/components/title";
import React from "react";

type Props = {};

const Security = (props: Props) => {
  return (
    <NavbarWrapper pageTitle={<div></div>}>
      <div className="py-4 px-5 w-full h-full flex flex-col gap-4">
        <Title title="Security Leaderboard" />
        <SecurityLeaderBoard />
      </div>
    </NavbarWrapper>
  );
};

export default Security;
