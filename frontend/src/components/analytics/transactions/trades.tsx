import { formatAddress } from '@/utils/format-address';

import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
// import SelectTopToken from '../select-top-token';
import TotalTransactionTable from './total-transaction-table';
import { tableHead, totalTransactionTableData } from '../token-constant';
import Link from 'next/link';
import { HoldersDemoData } from './demo-table-data';
import TableHead from '../table-head';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatAge } from '@/utils/format-age';
import { formatNumber } from '@/utils/format-number';

const TradesTable = ({ pair, symbol, base }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState<any[]>([]);

  const transformTradeData = tradeData => {
    // Add your transformation logic here
    return tradeData.map(trade => {
      const isBuy = trade.attributes.kind === 'buy';

      const dateString = trade.attributes.block_timestamp;
      const date = new Date(dateString);
      const unixTimestamp = Math.floor(date.getTime() / 1000);

      let color = 'text-green-600'; // Default color
      if (!isBuy) {
        color = 'text-red-600';
      }

      return {
        hash: trade.attributes.tx_hash,
        block_number: trade.attributes.block_number,
        timestamp: unixTimestamp,
        tokens: isBuy
          ? trade.attributes.from_token_amount
          : trade.attributes.to_token_amount,
        price: isBuy
          ? trade.attributes.price_to_in_usd
          : trade.attributes.price_from_in_usd,
        currency: isBuy
          ? trade.attributes.price_to_in_currency_token
          : trade.attributes.price_from_in_currency_token,
        volume: trade.attributes.volume_in_usd,
        address: trade.attributes.tx_from_address,
        color,
      };
    });
  };

  useMemo(() => {
    if (!pair) return;

    const loadData = async () => {
      const response = await axios.get(
        `/api/analytics/trades?address=${pair.toLowerCase()}`
      );

      setTrades(transformTradeData(response.data.data));
      setIsLoading(false);
    };

    loadData();
  }, [pair]);

  return (
    <div className="h-[400px] overflow-auto">
      {isLoading ? (
        <Skeleton className="w-full h-96" />
      ) : (
        <Table className="w-full">
          {/* <div className="sticky top-0"> */}
          <TableHead tableHead={['', 'Address', 'Amount', 'Price', 'Time']} />
          {/* </div> 
          {
        {
            "id": "eth_19050534_0xf82279e3afcd550925678c080dfe726111a2b05076a7cf865a3637c0e9ffaed7_323_1705783391",
            "type": "trade",
            "attributes": {
                "block_number": 19050534,
                "tx_hash": "0xf82279e3afcd550925678c080dfe726111a2b05076a7cf865a3637c0e9ffaed7",
                "tx_from_address": "0x498586424c3ba11c9a5da2fe84e2497b5c35ebe2",
                "from_token_amount": "0.22552479760947",
                "to_token_amount": "5658.442279089",
                "price_from_in_currency_token": "1.0",
                "price_to_in_currency_token": "0.000039856339693153",
                "price_from_in_usd": "2464.84210673481",
                "price_to_in_usd": "0.0982395842960095",
                "block_timestamp": "2024-01-20T20:42:47Z",
                "kind": "buy",
                "volume_in_usd": "555.883017260668",
                "from_token_address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to_token_address": "0x55a8f6c6b3aa58ad6d1f26f6afeded78f32e19f4"
            }
        },
        {
            "id": "eth_19050462_0x86b06b2cf8e0d8f932f3d3628ba0a3eddf28dc4392a72a161e84b9d1bf58a58e_242_1705782515",
            "type": "trade",
            "attributes": {
                "block_number": 19050462,
                "tx_hash": "0x86b06b2cf8e0d8f932f3d3628ba0a3eddf28dc4392a72a161e84b9d1bf58a58e",
                "tx_from_address": "0x8bed692c0dad2aab8b0fdb52b41e95e9b876b674",
                "from_token_amount": "0.075",
                "to_token_amount": "1885.140677436",
                "price_from_in_currency_token": "1.0",
                "price_to_in_currency_token": "0.0000397848292690858",
                "price_from_in_usd": "2466.48415998123",
                "price_to_in_usd": "0.0981286511997577",
                "block_timestamp": "2024-01-20T20:28:23Z",
                "kind": "buy",
                "volume_in_usd": "184.986311998592",
                "from_token_address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to_token_address": "0x55a8f6c6b3aa58ad6d1f26f6afeded78f32e19f4"
            }
        },
          
          */}
          <TableBody>
            {trades?.map(item => (
              <TableRow
                key={item?.id}
                className="w-full p-2 border-b border-zinc-800"
              >
                <TableCell className="items-center">
                  {symbol}/<span className="text-gray-500">{base}</span>
                </TableCell>
                <TableCell className="text-blue-400 text-[14px]">
                  {formatAddress(item.address)}
                </TableCell>
                <TableCell className={item.color}>
                  ${formatNumber(item.volume)}
                </TableCell>
                <TableCell className={`min-w-[90px] ${item.color}`}>
                  ${Number(item.price).toFixed(5)}
                </TableCell>
                <TableCell className="">
                  {formatAge(parseInt(item.timestamp) * 1000, true)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TradesTable;
