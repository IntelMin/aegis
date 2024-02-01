import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { TableBody, TableCell, TableRow } from '../ui/table';
import { formatDate } from '@/utils/format-date';
import { formatTime } from '@/utils/format-time';
import { Skeleton } from '../ui/skeleton';
import { toast } from '../ui/use-toast';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { Loader, Table } from 'lucide-react';
import { EmptyRow } from './empty-row';

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

      console.log(`----report data: ${JSON.stringify(data)}`);
      setLoading(true);

      const fetchPromises = data
        .filter(item => item.address !== null)
        .map(item =>
          fetch(`/api/token/info?address=${item.address}&type=meta`)
            .then(res => res.json())
            .then(fetchedData => ({
              address: item.address as string,
              created_at: item.created_at,
              symbol: fetchedData.symbol,
              imageSmallUrl: fetchedData.imageSmallUrl,
            }))
        );

      Promise.all(fetchPromises).then(results => {
        const sortedResults = results.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setAuditData(sortedResults as auditDataType[]);
        setLoading(false);
      });
    }
    fetchData();
  }, [data]);

  if (loading)
    return (
      <TableBody>
        <TableCell colSpan={3}>
          <Loader className="w-full h-[30px] animate-spin" />
        </TableCell>
      </TableBody>
    );

  return (
    <TableBody>
      {audit_data.length === 0 ? (
        <EmptyRow col={3} message="No reports generated yet" />
      ) : (
        audit_data.map((item, index: number) => (
          <TableRow
            className="items-center bg-zinc-900 border-b border-zinc-800 "
            key={index}
          >
            <TableCell className="py-4 px-4 flex items-center justify-center gap-2 text-center">
              <Image
                src={
                  item.imageSmallUrl
                    ? `/api/token/image?q=${item.imageSmallUrl}`
                    : '/icons/token-default.svg'
                }
                alt="token-svg"
                width={24}
                height={24}
              />
              <p className="text-zinc-100 text-[12px] font-[400]">
                {item.symbol ? item.symbol : 'N/A'}
              </p>
            </TableCell>
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
