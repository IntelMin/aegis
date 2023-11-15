import React from "react";
import { NavbarWrapper } from "@/components/navbar/navbar";
import Title from "@/components/title";
import SecurityLeaderBoard from "@/components/security/SecurityLeaderBoard";
import LiveMetric from "@/components/liveMonitoring/LiveMetric";

type Props = {};

const LiveMonitoring = (props: Props) => {
  return (
    <NavbarWrapper pageTitle={<div></div>}>
      <div className="py-4 px-5 w-full h-full flex flex-col gap-4">
        <Title title="Live Monitoring" />
        <LiveMetric />
        <SecurityLeaderBoard search />
      </div>
    </NavbarWrapper>
  );
};

export default LiveMonitoring;
