'use client';
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

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import copy from 'copy-to-clipboard';
import { formatAddress } from '@/utils/format-address';
import { tableData } from './dummydata';
import { IoMdClose } from 'react-icons/io';
import { Separator } from '@/components/ui/separator';

type Report = {
  id: number;
  name: string;
  address: string;
  user_id: number;
  status: string;
  image_url: string;
};

const ReportsPage = () => {
  const tablehead = ['', '', 'TOKEN', 'CA', 'AUDITED DATE', 'FINDINGS'];
  const [tokenState, setTokenState] = useState({
    tokenIcon: '',
    tokenName: '',
    tokenInfo: '',
    tokenAddress: '',
  });
  const dataToPercent = (data: number[]) => {
    const total = data.reduce((a, b) => a + b, 0);
    return data.map(item => (item / total) * 100);
  };
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [reqAddress, setReqAddress] = useState('');

  const handleCopy = (data: string) => {
    copy(data);
  };
  const requestNewReport = async (address: string) => {
    const contractAddress = address;
    try {
      const response = await fetch('/api/audit/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: contractAddress,
        }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        const intervalId = setInterval(async () => {
          const response = await fetch(
            `/api/audit/report?address=${contractAddress}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          );
          console.log(response);

          if (response.ok) {
            const data = await response.json();
            if (data.status === 'success') {
              const pdfData = data.report; // base64-encoded PDF data
              const pdfBlob = new Blob([atob(pdfData)], {
                type: 'application/pdf',
              });
              const pdfUrl = URL.createObjectURL(pdfBlob);
              const link = document.createElement('a');
              link.href = pdfUrl;
              link.download =
                data.name != 'undefined' ? `${data.name}` : 'report.pdf'; // specify the filename for the downloaded PDF

              // Append the link to the body
              document.body.appendChild(link);

              // Programmatically click the link to start the download
              link.click();

              // Remove the link when done
              document.body.removeChild(link);
              clearInterval(intervalId);
            }
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Error requesting report:', error);
    }
  };
  const requestReport = async (address: string) => {
    const response = await fetch(`/api/audit/report?address=${address}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(response);

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      if (data.status === 'success') {
        const pdfData = data.report; // base64-encoded PDF data
        const pdfBlob = new Blob([atob(pdfData)], {
          type: 'application/pdf',
        });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download =
          data.name != 'undefined' ? `${data.name}` : 'report.pdf'; // specify the filename for the downloaded PDF

        // Append the link to the body
        document.body.appendChild(link);

        // Programmatically click the link to start the download
        link.click();

        // Remove the link when done
        document.body.removeChild(link);
      }
    }
  };

  useEffect(() => {
    async function fetchReports() {
      const response = await fetch('/api/getallReports');
      const data = await response.json();
      console.log(data);
      setReports(data.reports);
    }
    fetchReports();
  }, []);

  return (
    <div className="w-full flex justify-center pt-16 relative">
      <div className="w-[80%] flex flex-col gap-8">
        <div className="w-full flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-neutral-200 font-bold">Reports</h1>
            <p className="text-[12px] text-netural-400 text-[400]">
              Audit reports generated by community
            </p>
          </div>
          <button className="bg-[#0E76FD] p-2 flex items-center justify-center gap-1">
            <Image
              src="/icons/nav/reports.svg"
              alt="report-icon"
              width={16}
              height={16}
              style={{
                filter: 'invert(100%) brightness(1000%) contrast(100%)',
              }}
            />
            <p className="text-[16px] font-[500] text-zinc-50">
              Request Report
            </p>
          </button>
        </div>
        <Table>
          <TableHeader className="bg-[#0D0D0D]">
            {tablehead?.map((head, index) => (
              <TableHead key={index}>{head}</TableHead>
            ))}
          </TableHeader>
          <TableBody className="bg-[#151515]">
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
                <TableCell className="text-[12px] font-[400] text-neutral-100">
                  {data?.tokenInfo}
                </TableCell>
                <TableCell className="text-[12px] font-[400] text-neutral-100">
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
                    <p className="text-neutral-200 text-[12px] font-[400]">
                      {data?.auditDate}
                    </p>
                    <p className="text-neutral-200 text-[12px] font-[400] uppercase">
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
                            <p className="text-neutral-200 text-sm">
                              High: {data.percentageData[0]}
                            </p>
                          </div>
                          <Separator />
                          <div className="flex items-center gap-2">
                            <div className="rounded-full w-[12px] h-[12px] bg-[#0096B7]" />
                            <p className="text-neutral-200 text-sm">
                              Medium: {data.percentageData[1]}
                            </p>
                          </div>
                          <Separator />
                          <div className="flex items-center gap-2">
                            <div className="rounded-full w-[12px] h-[12px] bg-[#D49900]" />
                            <p className="text-neutral-200 text-sm">
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
      </div>
      {showModal && (
        <div className="absolute w-[340px] h-full right-4 top-12 z-[20] rounded-[4px]">
          <div
            className="w-[340px] relative h-[200px] flex items-center justify-center border border-b-0 border-neutral-800"
            style={{
              background: 'url(/backgrounds/report-iconbg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'top center',
            }}
          >
            <div className="p-3 rounded-full border border-dotted border-neutral-700 w-fit">
              <div className="p-3 rounded-full border border-dashed border-neutral-800 w-fit">
                <Image
                  src={tokenState?.tokenIcon}
                  alt="token-icons"
                  width={48}
                  height={48}
                />
              </div>
            </div>
            <button
              type="button"
              className="absolute top-2 left-2"
              onClick={() => {
                setShowModal(false);
              }}
            >
              <IoMdClose className="text-2xl text-zinc-400" />
            </button>
          </div>
          <div className="p-4 bg-[#0D0D0D] flex flex-col gap-4 border border-t-0 border-neutral-800">
            <div className="flex gap-2 items-center">
              <p className="text-neutral-200 text-[16px] text-bold">
                {tokenState?.tokenName}
              </p>
              <p className="text-neutral-500 text-sm text-[400]">
                {tokenState?.tokenInfo}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-[13px] text-blue-400">
                {formatAddress(tokenState?.tokenAddress)}
              </p>
              <button
                type="button"
                onClick={() => handleCopy(tokenState?.tokenAddress)}
              >
                <Image
                  src="/icons/copy.svg"
                  alt="copy"
                  width={12}
                  height={12}
                />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              <div className="h-[200px] overflow-y-scroll">
                {'Aave is a decentralized money market protocol where users can lend and borrow cryptocurrency across 20 different assets as collateral. The protocol has a native token called AAVE, which is also a governance token that lets the community decide the direction of the protocol in a collective manner. Lenders can earn interest by providing liquidity to the market, while borrowers can borrow by collateralizing their cryptoassets to take out loans from the liquidity pools.'
                  ?.split('.')
                  ?.slice(0, -1)
                  ?.map((item, i) => (
                    <p
                      className="text-sm text-neutral-300 font-[300] flex items-center"
                      key={i}
                    >
                      {item}.
                    </p>
                  ))}
              </div>
              <button className="bg-[#0E76FD] p-2 flex items-center justify-center gap-1 w-full">
                <Image
                  src="/icons/nav/reports.svg"
                  alt="report-icon"
                  width={16}
                  height={16}
                  style={{
                    filter: 'invert(100%) brightness(1000%) contrast(100%)',
                  }}
                />
                <p className="text-[16px] font-[500] text-zinc-50">
                  Download Report
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
