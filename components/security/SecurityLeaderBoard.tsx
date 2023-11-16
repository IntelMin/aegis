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
} from "@nextui-org/react";
import { SearchIcon } from "../icons";
import { AiOutlineLock } from "react-icons/ai";

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

const rows = [
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
];

const SecurityLeaderBoard = (props: Props) => {
  const [filterValue, setFilterValue] = React.useState("");
  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
  }, []);

  return (
    <div>
      <div className={`flex gap-2 ${props?.search ? "blur-[2px]" : ""}`}>
        <Input
          isClearable
          className="w-full sm:max-w-[44%] mb-2 ml-2 "
          placeholder="Search by name..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onClear()}
          isDisabled={props.search ? true : false}
          onValueChange={onSearchChange}
        />
        <button
          type="button"
          className="bg-[#4d4d4d] text-[14px] px-6 py-[0px] rounded-md h-[40px]"
        >
          Submit
        </button>
      </div>
      <div className="p-2 relative">
        <button
          disabled
          className="absolute top-1/2 left-1/2 w-[full] -translate-x-1/2 -translate-y-1/2 h-[full] z-[999] bg-gradient-to-r from-[#1a1a1ad0] via-[#383838] to-gray-700 rounded-lg p-3 px-6 flex items-center justify-center gap-4"
        >
          Exclusive Feature
          <AiOutlineLock />
        </button>
        <Table aria-label="Audit Function Table" className="blur-[5px]">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>
                {column.label.toUpperCase()}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SecurityLeaderBoard;
