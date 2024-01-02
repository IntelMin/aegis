"use client";

import React, { useEffect, useState } from "react";
import DashboardDataTable from "@/components/dashboard/dashboard-data-table"
import DropdownFilter from "@/components/dashboard/drop-down-filter";
import TokenMarquee from "@/components/token-marquee";
import axios from "axios";
import { CollectionProps } from "@/types";

const AEGIS_SERVER = "http://localhost:9898";

const Dashboard = () => {
  const [collections, setCollections] = useState<CollectionProps[]>([]);
  const [chainId, setChainId] = useState("1");
  const [time, setTime] = useState("1D");
  const [tableData, setTableData] = useState([]);
  const [marqueeData, setMarqueeData] = useState([]);
  const [tableLimit, setTableLimit] = useState(20);

  useEffect(() => {
    axios.get(`${AEGIS_SERVER}/dashboard/collections`).then((response) => {
      setCollections(response.data.data.getNetworks);
    });
  }, []);

  useEffect(() => {
    axios
      .get(
        `${AEGIS_SERVER}/dashboard/top-tokens?chain_id=${chainId}&limit=${tableLimit}&resolution="${time}"`
      )
      .then((response) => {
        setTableData(response.data.data.listTopTokens);
      });
  }, [chainId, time, tableLimit]);

  useEffect(() => {
    axios.get(`${AEGIS_SERVER}/trending/new`).then((response) => {
      console.log("marquee data test", response.data.items);
      setMarqueeData(response?.data.items);
    });
  }, []);

  return (
    <div className="px-10 py-10">
      <div className="grid grid-cols-1 gap-6 relative z-[-1]">
        <TokenMarquee marqueeData={marqueeData} />
      </div>
      <DropdownFilter
        setChainId={setChainId}
        chainId={chainId}
        collections={collections}
        time={time}
        setTime={setTime}
      />
      <DashboardDataTable tableLimit={tableLimit} setTableLimit={setTableLimit} tableData={tableData} />
    </div>
  );
};

export default Dashboard;
