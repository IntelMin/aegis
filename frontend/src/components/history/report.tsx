import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { TableBody, TableCell, TableRow } from '../ui/table';
import { formatDate } from '@/utils/format-date';
import { formatTime } from '@/utils/format-time';
import { Skeleton } from '../ui/skeleton';
import { toast } from '../ui/use-toast';
import ScaleLoader from 'react-spinners/ScaleLoader';

type Historytype = {
  type: string;
  created_at: Date;
  address: string | null;
  id: number;
  user_id: number;
  cost: number;
};
type auditDataType = {
  address: string;
  created_at: Date;
  symbol: string;
  imageSmallUrl: string;
};

type Props = {
  data: Historytype[];
};
export const ReportTableBody = ({ data }: Props) => {
  const [audit_data, setAuditData] = React.useState<auditDataType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const requestReport = async (address: string) => {
    setSubmitting(true);
    const response = await fetch(`/api/audit/report?address=${address}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 404) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Report not found.',
      });
      setSubmitting(false);
      return;
    }

    if (response.ok) {
      const data = await response.json();
      if (data.status === 'failed') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.message,
        });
        setSubmitting(false);
        return;
      }
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
        setSubmitting(false);
        document.body.removeChild(link);
        toast({
          variant: 'default',
          title: 'Success',
          description: 'Report downloaded successfully.',
        });
      }
    }
  };
  useEffect(() => {
    async function fetchData() {
      if (data.length === 0) return;
      setLoading(true);
      const _audit_data: auditDataType[] = [];
      const r = data.forEach(async item => {
        if (item.address === null) return;
        const res = await fetch(
          `/api/token/info?address=${item.address}&type=meta`
        );
        const data = await res.json();
        _audit_data.push({
          address: item.address,
          created_at: item.created_at,

          symbol: data.symbol,
          imageSmallUrl: data.imageSmallUrl,
        });
      });
      setAuditData(_audit_data);
      setLoading(false);
    }
    fetchData();
  }, [data]);

  return (
    <TableBody>
      {audit_data.length == 0 ? (
        <TableRow
          className=" flex flex-row w-full items-center bg-zinc-900 border-b border-zinc-800 "
          key={1}
        >
          <TableCell className="flex items-center justify-center gap-2 text-center">
            <Skeleton className="w-[30px] h-[20px]" />
          </TableCell>
          <TableCell className="flex items-center justify-center gap-2 text-center">
            <Skeleton className="w-[30px] h-[20px]" />
          </TableCell>
          <TableCell className="flex items-center justify-center gap-2 text-center">
            <Skeleton className="w-[30px] h-[20px]" />
          </TableCell>
          <TableCell className="flex items-center justify-center gap-2 text-center">
            <Skeleton className="w-[30px] h-[20px]" />
          </TableCell>
        </TableRow>
      ) : (
        audit_data.map((item, index: number) => (
          <TableRow
            className="items-center bg-zinc-900 border-b border-zinc-800 "
            key={index}
          >
            {loading ? (
              <TableCell className="py-4 px-4 flex items-center justify-center gap-2 text-center">
                <Skeleton className="w-[30px] h-[20px]" />
              </TableCell>
            ) : (
              <TableCell className="py-4 px-4 flex items-center justify-center gap-2 text-center">
                <Image
                  src={
                    item.imageSmallUrl
                      ? `/api/token/image?q=${item.imageSmallUrl
                          .split('/')
                          .pop()}`
                      : '/icons/token-default.svg'
                  }
                  alt="token-svg"
                  width={24}
                  height={24}
                />
                <p className="text-zinc-100 text-[12px] font-[400]">
                  ${item.symbol ? item.symbol : 'N/A'}
                </p>
              </TableCell>
            )}{' '}
            <TableCell className="py-2 px-4 text-neutral-100 text-center min-w-[180px]">
              {formatDate(item.created_at) + ' ' + formatTime(item.created_at)}
            </TableCell>
            <TableCell className="py-3 px-4 text-center">
              {submitting ? (
                <div className="flex items-center justify-center bg-[#0E76FD] w-full p-2">
                  <ScaleLoader width={4} height={10} color="white" />
                </div>
              ) : (
                <Button
                  onClick={() => requestReport(item.address)}
                  className="py-1 h-[30px] px-2 text-[12px] text-blue-400"
                  style={{
                    background: `rgba(96, 165, 250, 0.10)`,
                  }}
                >
                  <Image
                    src="/icons/download-report.svg"
                    alt="download-icon"
                    width={16}
                    height={16}
                  />
                  <p className="text-blue-400 text-[12px] ml-1">Download</p>
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  );
};