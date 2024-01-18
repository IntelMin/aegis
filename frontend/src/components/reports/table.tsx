import React, { SetStateAction } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';
import { formatAddress } from '@/utils/format-address';
import copy from 'copy-to-clipboard';
import { Separator } from '../ui/separator';

type Props = {
  tablehead: string[];
  tableData: {
    tokenIcon: string;
    tokenName: string;
    tokenInfo: string;
    tokenAddress: string;
    auditDate: string;
    auditTime: string;
    percentageData: number[];
  }[];
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  setTokenState: React.Dispatch<
    SetStateAction<{
      tokenIcon: string;
      tokenName: string;
      tokenInfo: string;
      tokenAddress: string;
    }>
  >;
};

export const ReportsTable = ({
  tablehead,
  tableData,
  setShowModal,
  setTokenState,
}: Props) => {
  const handleCopy = (data: string) => {
    copy(data);
  };
  const dataToPercent = (data: number[]) => {
    const total = data.reduce((a, b) => a + b, 0);
    return data.map(item => (item / total) * 100);
  };
  return (
    <>
      <Table>
        <TableHeader className="bg-[#0D0D0D]">
          {tablehead?.map((head, index) => (
            <TableHead key={index}>{head}</TableHead>
          ))}
        </TableHeader>
        <TableBody
          className={tableData.length === 0 ? 'bg-transparent' : 'bg-[#151515]'}
        >
          {tableData?.map((data, i) => (
            <TableRow
              onClick={() => {
                setShowModal(true);
                setTokenState({
                  tokenIcon: data?.tokenIcon,
                  tokenName: data?.tokenName,
                  tokenInfo: data?.tokenInfo,
                  tokenAddress: data?.tokenAddress,
                });
              }}
              key={i}
              className="border-b border-[#262626]"
            >
              <TableCell>
                <Image
                  src={data?.tokenIcon}
                  alt="token-icon"
                  width={20}
                  height={20}
                />
              </TableCell>
              <TableCell className="text-[12px] font-[400] text-zinc-100">
                {data?.tokenInfo}
              </TableCell>
              <TableCell className="text-[12px] font-[400] text-zinc-100">
                {data?.tokenName}
              </TableCell>
              <TableCell className="flex items-center gap-1">
                <p className="text-[12px] text-blue-400 uppercase">
                  {formatAddress(data?.tokenAddress)}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(data?.tokenAddress)}
                >
                  <Image
                    src="/icons/copy.svg"
                    alt="copy"
                    width={12}
                    height={12}
                  />
                </button>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <p className="text-zinc-200 text-[12px] font-[400]">
                    {data?.auditDate}
                  </p>
                  <p className="text-zinc-200 text-[12px] font-[400] uppercase">
                    {data?.auditTime}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="w-full">
                      <div className="w-full min-w-[300px] h-[20px] flex items-center">
                        <div
                          className={`h-[20px] bg-[#353535]`}
                          style={{
                            width: `${dataToPercent(data.percentageData)[0]}%`,
                          }}
                        />
                        <div
                          className={`h-[20px] bg-[#0096B7]`}
                          style={{
                            width: `${dataToPercent(data.percentageData)[1]}%`,
                          }}
                        />
                        <div
                          className={`h-[20px] bg-[#D49900]`}
                          style={{
                            width: `${dataToPercent(data.percentageData)[2]}%`,
                          }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      sideOffset={8}
                      className="translate-x-4 p-2"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full w-[12px] h-[12px] bg-[#353535]" />
                          <p className="text-zinc-200 text-sm">
                            High: {data.percentageData[0]}
                          </p>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-2">
                          <div className="rounded-full w-[12px] h-[12px] bg-[#0096B7]" />
                          <p className="text-zinc-200 text-sm">
                            Medium: {data.percentageData[1]}
                          </p>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-2">
                          <div className="rounded-full w-[12px] h-[12px] bg-[#D49900]" />
                          <p className="text-zinc-200 text-sm">
                            Low: {data.percentageData[2]}
                          </p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {tableData?.length === 0 && (
        <div className="w-[full] flex justify-center items-center flex-col my-4">
          <Image
            src="/icons/no-data.svg"
            alt="no-data"
            width={155}
            height={150}
          />
          <p className="text-zinc-400 text-[12px] text-[400]">
            Request Audit Report
          </p>
        </div>
      )}
    </>
  );
};
