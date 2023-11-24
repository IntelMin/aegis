"use client";

import React from "react";
import {
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Tooltip,
} from "@nextui-org/react";
import { SearchIcon } from "../icons";
import CircleGraph from "../circleGraph";

type Props = {
  search?: boolean;
};

const columns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "security",
    label: "Security Score",
  },
  {
    key: "audits",
    label: "Audits",
  },
  {
    key: "price",
    label: "Price",
  },
  {
    key: "category",
    label: "Category",
  },
];

const initialRows = [
  {
    key: 1,
    name: "BitCoin",
    security: "98.67",
    audits: 2,
    price: "$35,574.45",
    category: "infastructure",
  },
  {
    key: 2,
    name: "Ethereum",
    security: "68.67",
    audits: 2,
    price: "$85,574.45",
    category: "defi",
  },
  {
    key: 3,
    name: "Aptos",
    security: "88.67",
    audits: 2,
    price: "$5,574.45",
    category: "gaming",
  },
  {
    key: 4,
    name: "Ripple",
    security: "75.89",
    audits: 1,
    price: "$12,345.67",
    category: "finance",
  },
  {
    key: 5,
    name: "Litecoin",
    security: "88.34",
    audits: 3,
    price: "$2,345.12",
    category: "cryptocurrency",
  },
  {
    key: 6,
    name: "Cardano",
    security: "92.45",
    audits: 4,
    price: "$1,234.56",
    category: "blockchain",
  },
  {
    key: 7,
    name: "Polkadot",
    security: "56.78",
    audits: 2,
    price: "$3,456.78",
    category: "technology",
  },
  {
    key: 8,
    name: "Chainlink",
    security: "80.12",
    audits: 3,
    price: "$7,890.12",
    category: "smart contracts",
  },
  {
    key: 9,
    name: "Stellar",
    security: "67.45",
    audits: 1,
    price: "$9,876.54",
    category: "finance",
  },
  {
    key: 10,
    name: "Dogecoin",
    security: "45.23",
    audits: 1,
    price: "$6,543.21",
    category: "memecoin",
  },
  {
    key: 12,
    name: "EOS",
    security: "60.34",
    audits: 2,
    price: "$8,765.43",
    category: "blockchain",
  },
  {
    key: 13,
    name: "Monero",
    security: "85.67",
    audits: 3,
    price: "$5,432.10",
    category: "privacy",
  },
  {
    key: 14,
    name: "Tezos",
    security: "73.21",
    audits: 1,
    price: "$1,234.56",
    category: "smart contracts",
  },
  {
    key: 15,
    name: "Neo",
    security: "91.45",
    audits: 4,
    price: "$3,210.98",
    category: "blockchain",
  },
  {
    key: 16,
    name: "IOTA",
    security: "64.78",
    audits: 2,
    price: "$9,876.54",
    category: "Internet of Things",
  },

  {
    key: 18,
    name: "Tron",
    security: "53.12",
    audits: 1,
    price: "$8,765.43",
    category: "blockchain",
  },
  {
    key: 19,
    name: "Zcash",
    security: "49.34",
    audits: 2,
    price: "$6,543.21",
    category: "privacy",
  },
  {
    key: 20,
    name: "Qtum",
    security: "92.56",
    audits: 3,
    price: "$4,321.09",
    category: "blockchain",
  },
  {
    key: 21,
    name: "Ontology",
    security: "74.23",
    audits: 2,
    price: "$1,234.56",
    category: "smart contracts",
  },
  {
    key: 22,
    name: "Decred",
    security: "99.45",
    audits: 3,
    price: "$3,210.98",
    category: "cryptocurrency",
  },
  {
    key: 23,
    name: "NEM",
    security: "27.67",
    audits: 1,
    price: "$9,876.54",
    category: "blockchain",
  },
  {
    key: 24,
    name: "BAT",
    security: "83.21",
    audits: 2,
    price: "$2,109.87",
    category: "crypto",
  },
];

const SecurityLeaderBoard = (props: Props) => {
  const [filterValue, setFilterValue] = React.useState("");
  const [rows, setRows] = React.useState(initialRows);
  const [filteredRows, setFilteredRows] = React.useState(initialRows);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      // Filter rows based on the 'name' property containing the search value
      const filteredRows = rows.filter((row) =>
        row.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRows(filteredRows);
      setFilterValue(value);
    } else {
      // If no search value, display all rows
      setFilteredRows(rows);
      setFilterValue("");
    }
  }, [rows]);

  const onClear = React.useCallback(() => {
    setFilteredRows(rows);
    setFilterValue("");
  }, [rows]);

  return (

    <div>
      <div className={`flex gap-2 ${props?.search ? "blur-[0px]" : ""}`}>
        <Input
          isClearable
          className="w-full sm:max-w-[44%] mb-2 ml-2 "
          placeholder="Search by name..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
      </div>
      <div className="p-2 relative">
        <Table aria-label="Audit Function Table" className="blur-[0px]">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>
                {column.label.toUpperCase()}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={filteredRows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "security" ? (
                      <SecurityMeter value={parseFloat(item[columnKey])} />
                    ) : (
                      getKeyValue(item, columnKey)
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
const SecurityMeter: React.FC<{ value: number }> = ({ value }) => {
  let bgColor;
  
  if (value < 50) {
    bgColor = "danger";
  } else if (value < 90) {
    bgColor = "secondary";
  } else {
    bgColor = "success";
  }
  return (
    <div className="flex items-start">
    <span className="mr-4">{value}%</span>
    <div className="w-full bg-gray-200 rounded-md h-4">
    <Tooltip content={<CircleGraph value={value} height={240}/>}>
        <div
          className={`bg-${bgColor} rounded-md h-full w-${value} transition-all duration-300`}
        />
    </Tooltip>
    </div>
    
  </div>
  
  );
};

export default SecurityLeaderBoard;
