import React from "react";
import { AiOutlineAudit } from "react-icons/ai";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const LiveMetric = (props: any) => {
  const [tokens, setTokens] = React.useState([]);

  React.useEffect(() => {
    // Safely load props.data.items into tokens
    if (Array.isArray(props.data?.items)) {
      setTokens(props.data.items);
    }
  }, [props.data]);

  const formatDecimal = (num: number) => {
    if (num === null) {
      return "N/A";
    }
    if (num > 1) {
      return num.toFixed(2);
    } else {
      return num.toFixed(5);
    }
  };

  const formatTime = (time: number) => {
    const now = new Date().getTime();
    const timestamp = new Date(time * 1000).getTime();
    const diff = now - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (hours > 1) {
      return `${hours} hrs ago`;
    } else if (hours === 1) {
      return `${hours} hr ago`;
    } else if (mins > 1) {
      return `${mins} mins ago`;
    } else if (mins === 1) {
      return `${mins} min ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className="flex p-2 rounded-md">
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>TOKEN</TableColumn>
          <TableColumn>PRICE</TableColumn>
          <TableColumn>CHANGE</TableColumn>
          <TableColumn>LIQUIDITY</TableColumn>
          <TableColumn>CREATED</TableColumn>
          <TableColumn>AUDIT</TableColumn>
        </TableHeader>
        <TableBody>
          {tokens?.slice(0, props.dash ? 4 : tokens.length)?.map((item: any, i: any) => {
            const selectedToken =
              item.newToken === "token0" ? item.token0 : item.token1;

            const truncatedName =
              selectedToken.name.length > 20
                ? selectedToken.name.substring(0, 20) + "..."
                : selectedToken.name;

            return (
              <TableRow key={i}>
                <TableCell>{truncatedName}</TableCell>
                <TableCell>{formatDecimal(item.priceChange)}</TableCell>
                <TableCell>{formatDecimal(item.priceChange)}%</TableCell>
                <TableCell>
                  {formatDecimal(parseFloat(item.liquidity))}
                </TableCell>
                <TableCell>{formatTime(item.liquidAt)}</TableCell>
                <TableCell>
                  <Link href={`/audits/${selectedToken.address}`} passHref>
                    <Button size="sm">View</Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LiveMetric;
