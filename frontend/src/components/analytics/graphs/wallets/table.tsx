import React, { useEffect, useState } from 'react';
import { formatAddress } from '@/utils/format-address';
import { formatNumber } from '@/utils/format-number';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  data: any;
}

const ClusterHold: React.FC<Props> = ({ data }) => {
  const [parsedData, setParsedData] = useState<any>([]);
  const [holders, setHolders] = useState<any>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!data) return;

    console.log(`holder data`, data);

    let sortedData = data
      .map((d: { balance: any }) => ({
        ...d,
        balance: Number(d.balance),
      }))
      .sort(
        (a: { balance: number }, b: { balance: number }) =>
          b.balance - a.balance
      );

    const total = sortedData.length;
    const percentile1 = sortedData[Math.floor(total * 0.01)].balance;
    const percentile5 = sortedData[Math.floor(total * 0.05)].balance;
    const percentile10 = sortedData[Math.floor(total * 0.1)].balance;

    const parsedData = sortedData.map(node => {
      let color = 'bg-[#2563EB]'; // Default color

      if (node.balance >= percentile1) {
        color = 'bg-[#FFBB0B]';
      } else if (node.balance >= percentile5) {
        color = 'bg-[#0BFF50]';
      }

      return {
        link: node.address,
        label: node.addressLabel?.label || formatAddress(node.address),
        balance: formatNumber(node.balance),
        color,
      };
    });

    console.log('parsedData', parsedData);
    setParsedData(parsedData);
    setHolders(parsedData);
  }, [data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);

    const filteredData = parsedData.filter((d: any) => {
      return d.label.toLowerCase().includes(searchValue.toLowerCase());
    });

    setSearch(searchValue);
    setHolders(filteredData);
  };

  return (
    <div className="bg-zinc-900 p-2">
      <div>
        <div className="flex bg-zinc-800 p-2 gap-2 w-full mb-3">
          <Image src="/icons/search.svg" alt="token" width={28} height={28} />
          <input
            type="text"
            autoComplete="off"
            placeholder="Search wallets"
            className="w-[80%] max-md:hidden text-[14px] text-white placeholder:text-neutral-600 border-none outline-none bg-transparent"
            onInput={handleSearch}
            value={search}
          />
        </div>
      </div>
      <div className="flex flex-row text-xs font-medium uppercase bg-[#0B0B0B] border-b border-zinc-500 mb-3 justify-between ">
        <div className="flex justify-center p-2 w-[50%]">Wallets</div>
        <div className="flex justify-center p-2 w-[50%]">Amount</div>
      </div>
      <table className="w-full text-white">
        <ScrollArea className="w-full h-[400px]">
          <tbody>
            {holders?.map((holder, index) => (
              <tr
                key={holder.address}
                className={`items-center text-xs ${
                  index % 2 !== 0 ? 'bg-[#0B0B0B]' : 'bg-transparent'
                }`}
              >
                <td className="p-2 text-zinc-500 font-semibold">
                  #{index + 1}
                </td>
                <td className="text-blue-300 font-bold">
                  <Link
                    target="_blank"
                    href={`https://etherscan.io/address/${holder.address}`}
                  >
                    {holder.label}
                  </Link>
                </td>
                <td className="">{holder.balance}</td>
                <td className="">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${holder.color}`}
                  ></span>
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollArea>
      </table>
    </div>
  );
};

export default ClusterHold;
