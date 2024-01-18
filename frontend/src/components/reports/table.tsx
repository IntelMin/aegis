import React, { SetStateAction, use, useEffect } from 'react';
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
import { Skeleton } from '../ui/skeleton';
import { set } from 'date-fns';

type Props = {
  tablehead: string[];
  loading?: boolean;
  tokenState: {
    tokenIcon: string;
    tokenName: string;
    tokenInfo?: string;
    tokenAddress: string;
    loading?: boolean;
  };
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  setTokenState: React.Dispatch<
    SetStateAction<{
      tokenIcon: string;
      tokenName: string;
      tokenInfo?: string;
      tokenAddress: string;
      loading?: boolean;
    }>
  >;
};
type Report = {
  id: number;
  name: string;
  address: string;
  user_id: number;
  status: string;
  image_url: string;
  created_at: Date;
};
interface ReportState {
  tokenIcon: string;
  tokenName: string;
  tokenInfo?: string;
  tokenAddress: string;
  auditDate: string;
  auditTime: string;
  percentageData?: number[];
  imageSmallUrl?: string;
  user_id?: number;
}
export const ReportsTable = ({
  tablehead,
  setShowModal,
  setTokenState,
  tokenState,
}: Props) => {
  const handleCopy = (data: string) => {
    copy(data);
  };
  const [tableData, setTableData] = React.useState<ReportState[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [reportLoading, setReportLoading] = React.useState(false);

  const dataToPercent = (data: number[]) => {
    const total = data.reduce((a, b) => a + b, 0);
    if (total === 0) {
      return data.map((item, index) => (index === 0 ? 100 : 0));
    }
    return data.map(item => (item / total) * 100);
  };

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      setReportLoading(true);
      const response = await fetch('/api/reports');
      const data = await response.json();
      const table_report = data.reports.map((report: Report) => {
        return {
          tokenIcon: report.image_url,
          tokenName: report.name,
          tokenAddress: report.address,
          auditDate: new Date(report.created_at).toLocaleDateString(),
          auditTime: new Date(report.created_at).toLocaleTimeString(),
          user_id: report.user_id,
        };
      });
      setTableData(table_report);
      console.log(data);
      setReportLoading(false);

      const table_data: ReportState[] = await Promise.all(
        data.reports.map(async (report: Report) => {
          const data = await fetchFindings(report.address);
          console.log(data);
          return {
            tokenIcon: report.image_url,
            tokenName: report.name,
            tokenInfo: data.text,
            tokenAddress: report.address,
            auditDate: new Date(report.created_at).toLocaleDateString(),
            auditTime: new Date(report.created_at).toLocaleTimeString(),
            percentageData: [
              data.table.number_of_high_severity_issues,
              data.table.number_of_medium_severity_issues,
              data.table.number_of_low_severity_issues,
            ],
          };
        })
      );

      setTableData(table_data);
      setLoading(false);
    }
    fetchReports();
    async function fetchFindings(address: string) {
      const response = await fetch(
        `/api/token/info?address=${address}&type=summary`
      );
      const data = await response.json();
      return data;
    }
  }, []);
  useEffect(() => {
    console.log('tableData', tableData);
    if (tokenState?.tokenAddress) {
      if (!tokenState?.tokenInfo) {
        if (!loading) {
          setTokenState({
            tokenIcon: tokenState.tokenIcon,
            tokenName: tokenState.tokenName,
            tokenInfo: tokenState.tokenInfo,
            tokenAddress: tokenState.tokenAddress,
            loading: false,
          });
        }
      }
    }
  }, [loading, tableData, tokenState?.tokenAddress]);

  return (
    <>
      <Table>
        <TableHeader className="bg-[#0D0D0D]">
          {tablehead?.map((head, index) => (
            <TableHead key={index}>{head}</TableHead>
          ))}
        </TableHeader>
        <TableBody
          className={
            tableData.length === 0 ? 'bg-transparent h-full' : 'bg-[#151515]'
          }
        >
          {reportLoading && (
            <TableRow className="border-b border-[#262626]">
              <TableCell>
                <Skeleton className="w-full h-[25px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-[25px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-[25px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-[25px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-[25px]" />
              </TableCell>
            </TableRow>
          )}
          {tableData?.map((data, i) => (
            <TableRow
              onClick={() => {
                setShowModal(true);
                setTokenState({
                  tokenIcon: data?.tokenIcon,
                  tokenName: data?.tokenName,
                  tokenInfo: data?.tokenInfo,
                  tokenAddress: data?.tokenAddress,
                  loading: loading,
                });
              }}
              key={i}
              className="border-b border-[#262626]"
            >
              <TableCell>
                <Image
                  src={
                    data.tokenIcon
                      ? `/api/token/image?q=${data.tokenIcon.split('/').pop()}`
                      : `/icons/token-default.svg`
                  }
                  alt={data.tokenName}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
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
                {!data.percentageData ? (
                  <Skeleton className="w-full" />
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <div className="w-full min-w-[300px] h-[20px] flex items-center">
                          <div
                            className={`h-[20px] bg-[#353535]`}
                            style={{
                              width: `${
                                dataToPercent(data.percentageData)[0]
                              }%`,
                            }}
                          />
                          <div
                            className={`h-[20px] bg-[#0096B7]`}
                            style={{
                              width: `${
                                dataToPercent(data.percentageData)[1]
                              }%`,
                            }}
                          />
                          <div
                            className={`h-[20px] bg-[#D49900]`}
                            style={{
                              width: `${
                                dataToPercent(data.percentageData)[2]
                              }%`,
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
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
