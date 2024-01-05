const btnOption = [
  { text: "Total Transaction", value: "TotalTransaction" },
  { text: "Transactions", value: "Transactions" },
  { text: "Liquidity Report", value: "LiquidityReport" },
  { text: "Holders", value: "Holders" },
  { text: "Trades", value: "Trades" },
  { text: "Owner", value: "Owner" },
];
const tableHead = ["Wallet", "Balance", "Value", "Scan"];
const transactionTableHead = [
  "Txn hash",
  "Age",
  "Block",
  "Method",
  "From",
  "To",
  "Value",
];
const totalTransactionTableData = [
  {
    id: 0,
    wallet: {
      name: "Binance",
      tokenIconUrl: "/token-icons/token-table.svg",
    },
    balance: "12,050,452,000.198",
    value: "103456789.23",
    scan: {
      network: "Etherscan",
      url: "#",
    },
  },
  {
    id: 1,
    wallet: {
      name: "Coinbase exchange",
      tokenIconUrl: "/token-icons/token-tabl2.svg",
    },
    balance: "10,230,089,254.02",
    value: "$1.289,879,091",
    scan: {
      network: "Etherscan",
      url: "#",
    },
  },
];
const transactionTable = [
  {
    id: 0,
    txnHash: "0x34e...45rty",
    age: "3mins ago",
    block: "10098623",
    method: "Transfer",
    from: "0x123...abcde",
    to: "0x34e...45rty",
    value: "865,098.098",
  },
  {
    id: 1,
    txnHash: "0x34e...45rty",
    age: "12mins ago",
    block: "10098623",
    method: "Transfer",
    from: "0x123...abcde",
    to: "0x34e...45rty",
    value: "865,098.098",
  },
  {
    id: 2,
    txnHash: "0x34e...45rty",
    age: "12hr ago",
    block: "10098623",
    method: "Transfer",
    from: "0x123...abcde",
    to: "0x34e...45rty",
    value: "865,098.098",
  },
];

type btnOptionType = {
  text: string;
  value: string;
}[]

type tableHeadType = string[]

type transactionTablHeadType = string[]

type totalTransactionTableType = {
  id: number;
  wallet: {
    name: string;
    tokenIconUrl: string;
  };
  balance: string;
  value: string;
  scan: {
    network: string;
    url: string;
  };
}[]

type transactionTableType = {
  id: number;
  txnHash: string;
  age: string;
  block: string;
  method: string;
  from: string;
  to: string;
  value: string;
}[]

export {
  btnOption, tableHead, transactionTableHead, totalTransactionTableData, transactionTable, type btnOptionType, type tableHeadType, type transactionTablHeadType, type totalTransactionTableType, type transactionTableType
}