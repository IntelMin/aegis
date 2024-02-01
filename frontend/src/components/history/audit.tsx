import React, { use, useEffect } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { TableBody, TableCell, TableRow } from '../ui/table';
import { formatDate } from '@/utils/format-date';
import { formatTime } from '@/utils/format-time';
import { FaEye } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import { Loader } from 'lucide-react';
import { EmptyRow } from './empty-row';
type Historytype = {
  type: string;
  created_at: Date;
  address: string | null;
  id: number;
  user_id: number;
  cost: number;
};
type Props = {
  data: Historytype[];
  type?: string;
  code?: boolean;
};
type auditDataType = {
  address: string;
  created_at: Date;
  symbol: string;
  imageSmallUrl: string;
};

export const AuditTableBody = ({ data, code, type }: Props) => {
  const router = useRouter();
  const [audit_data, setAuditData] = React.useState<auditDataType[]>([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    async function fetchData() {
      if (data.length === 0 || code) return;

      setLoading(true);

      const fetchPromises = data.map(item => {
        if (item.address === null) return null;
        return fetch(`/api/token/info?address=${item.address}&type=meta`)
          .then(res => res.json())
          .then(fetchedData => ({
            address: item.address,
            created_at: item.created_at,
            symbol: fetchedData.symbol,
            imageSmallUrl: fetchedData.imageSmallUrl,
          }));
      });

      Promise.all(fetchPromises).then(results => {
        const filteredResults = results.filter(result => result !== null);
        setAuditData(filteredResults as auditDataType[]);
        setLoading(false);
      });
    }
    fetchData();
  }, [data, code]);

  if (loading)
    return (
      <TableBody>
        <TableCell colSpan={code ? 2 : 3}>
          <Loader className="w-full h-[30px]" />
        </TableCell>
      </TableBody>
    );

  return (
    <TableBody>
      {audit_data.length === 0 ? (
        <EmptyRow col={3} message="No detail audits performed yet" />
      ) : (
        audit_data.map((item, index: number) => (
          <TableRow
            className="items-center bg-zinc-900 border-b border-zinc-800 "
            key={index}
          >
            {' '}
            {!code &&
              (loading ? (
                <TableCell className="py-4 px-4 flex items-center justify-center gap-2 text-center">
                  <Skeleton className="w-[30px] h-[20px]" />
                </TableCell>
              ) : (
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
                    ${item.symbol ? item.symbol : 'N/A'}
                  </p>
                </TableCell>
              ))}
            <TableCell className="py-2 px-4 text-neutral-100 text-center min-w-[180px]">
              <span> {formatDate(item.created_at)}</span>{' '}
              <span>{formatTime(item.created_at)}</span>
            </TableCell>
            {!code && (
              <TableCell className="py-3 px-4 text-center">
                <Button
                  onClick={() => {
                    router.push(`/audit/token/${item.address}/${type}`); // 1212 => address
                  }}
                  className="py-1 h-[30px] px-2 text-[12px] text-blue-400"
                  style={{
                    background: `rgba(96, 165, 250, 0.10)`,
                  }}
                >
                  <FaEye className="text-blue-400 text-[12px] mr-1" />
                  <p className="text-blue-400 text-[12px] ml-1">View</p>
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))
      )}
    </TableBody>
  );
};
