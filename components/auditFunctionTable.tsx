import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Input,
} from "@nextui-org/react";
import { SearchIcon } from "./icons";

const columns = [
  {
    key: "type",
    label: "Type",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "mutating",
    label: "Mutability",
  },
  {
    key: "spec",
    label: "Visibility",
  },
];

export type DataProps = {
  key: number;
  type: string | null;
  name: string | null;
  mutating: string | null;
  spec: string | null;
};

type Props = {
  data: DataProps[] | null;
};

const AuditFunctionTable = (props: Props) => {
  const [filterValue, setFilterValue] = React.useState("");
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...props?.data];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [props?.data, filterValue]);

  const rows = filteredItems.map((obj, index) => ({
    ...obj,
    key: index,
  }));

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
    <>
      <Input
        isClearable
        className="w-full sm:max-w-[44%] mb-2 ml-2"
        placeholder="Search by name..."
        startContent={<SearchIcon />}
        value={filterValue}
        onClear={() => onClear()}
        onValueChange={onSearchChange}
      />
      <Table aria-label="Audit Function Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label.toUpperCase()}</TableColumn>
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
    </>
  );
};

export default AuditFunctionTable;
