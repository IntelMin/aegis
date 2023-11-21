"use client";

import React, { useState, useEffect } from "react";
import { NavbarWrapper } from "@/components/navbar/navbar";
import Title from "@/components/title";
import SecurityLeaderBoard from "@/components/security/SecurityLeaderBoard";
import LiveMetric from "@/components/liveMonitoring/LiveMetric";

type Props = {};

const LiveMonitoring = (props: Props) => {

  const [newTokens, setNewTokens] = useState([]);

  useEffect(() => {
    fetch("/api/new")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setNewTokens(data);
      })
      .catch((err) => {
        console.log("error front");
        console.error(err);
      });
  }, []);
  return (
    <NavbarWrapper pageTitle={<div></div>}>
      <div className="flex flex-col w-full h-full gap-4 px-5 py-4">
        <Title title="Live Monitoring" />
        <LiveMetric data={newTokens} />
        {/* <SecurityLeaderBoard search /> */}
      </div>
    </NavbarWrapper>
  );
};

export default LiveMonitoring;
