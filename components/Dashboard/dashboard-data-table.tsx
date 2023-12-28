import React from "react";
import TableHead from "./table-head";
import TableRow from "./table-row";

type Props = {};

const DashboardDataTable = (props: Props) => {
  const data = [
    {
      time: "01:23",
      token: {
        iconSrc: "/token-icons/token.svg",
        iconAlt: "token-alt",
        name: "UNI",
        fullName: "Uniswap",
        address: "0x34e...45rty",
      },
      tax: "03/100",
      price: "$2.870",
      mCap: {
        total: "$2,600,980.00",
        available: "$1,800,080.00",
      },
      maxBuy: "0.1%",
      liquidity: {
        value: "$2,980.00",
        units: "23.87 WMATICs",
      },
      rate30min: "0.25%",
      rate1hr: "0.25%",
      rate4hr: "0.25%",
    },
    {
      time: "02:45",
      token: {
        iconSrc: "/token-icons/token.svg",
        iconAlt: "another-token-alt",
        name: "ETH",
        fullName: "Ethereum",
        address: "0xabc...123xyz",
      },
      tax: "05/100",
      price: "$3,500",
      mCap: {
        total: "$3,200,000.00",
        available: "$2,000,000.00",
      },
      maxBuy: "0.2%",
      liquidity: {
        value: "$4,500.00",
        units: "30.00 ETH",
      },
      rate30min: "0.5%",
      rate1hr: "0.75%",
      rate4hr: "0.9%",
    },
    {
      time: "03:12",
      token: {
        iconSrc: "/token-icons/token.svg",
        iconAlt: "yet-another-token-alt",
        name: "BTC",
        fullName: "Bitcoin",
        address: "0xxyz...987abc",
      },
      tax: "02/100",
      price: "$50,000",
      mCap: {
        total: "$1,000,000,000.00",
        available: "$800,000,000.00",
      },
      maxBuy: "0.05%",
      liquidity: {
        value: "$20,000,000.00",
        units: "100.00 BTC",
      },
      rate30min: "0.1%",
      rate1hr: "0.2%",
      rate4hr: "0.3%",
    },
  ];
  return (
    <div className="mt-6 border border-zinc-800 p-3">
      <table className="w-full">
        <TableHead />
        {data?.map((item, i) => (
          <TableRow item={item} index={i} />
        ))}
      </table>
    </div>
  );
};

export default DashboardDataTable;
