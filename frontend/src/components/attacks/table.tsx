import { FC, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import GridLoader from 'react-spinners/GridLoader';
import { formatNumber } from '@/utils/format-number';
import { formatAge } from '@/utils/format-age';
import Link from 'next/link';

interface AttacksTableProps {
  loading: boolean;
  options: any[];
  results: any[];
}

const AttacksTable: FC<AttacksTableProps> = ({ loading, options, results }) => {
  const current_page = results.offset + 1;
  const last_page = results.pages;

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-96">
        <GridLoader color="white" />
      </div>
    );
  }
  return (
    <div className="pt-6 pl-2">
      {/* {options.length && options?.searchTerm.length > 0 && (
        <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
          <h3 className="text-neutral-200 text-[20px] font-[600]">
            Search: {options?.searchTerm}
          </h3>
          <div className="flex items-center gap-1">
            <p className="text-neutral-200 text-[16px]">Total:</p>
            <span className="text-green-400 text-[16px]">{results?.total}</span>
          </div>
        </div>
      )} */}

      <div className="flex flex-col pl-4 pt-1">
        {results.attacks.map((attack: any) => (
          <div className="border border-zinc-800 p-4 mb-6 rounded-lg">
            <div className="flex pb-2 justify-between">
              <h1 className="text-lg font-bold text-zinc-200">
                {attack.target}
              </h1>
              <div className="font-semibold text-md">
                {!isNaN(parseFloat(attack.amount)) &&
                parseFloat(attack.amount) !== 0
                  ? '$' + parseFloat(attack.amount).toLocaleString('en-US')
                  : parseFloat(attack.amount) === 0
                  ? 'N/A'
                  : attack.amount}
              </div>
            </div>
            <p className="text-zinc-500 pb-2 w-[95%] break-words text-base leading-relaxed">
              {attack.description}
            </p>
            <div className="flex justify-between">
              <Badge variant="outline">{attack.attack_vector}</Badge>
              <Link href={attack.reference}>
                <Button variant="outline">Reference</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          {current_page > 1 && (
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
          )}

          {Array.from({ length: last_page }).map((_, index) => {
            const page = index + 1;
            if (
              page === current_page ||
              page === current_page - 1 ||
              page === current_page + 1
            ) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            return null;
          })}

          {/* <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem> */}

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          {current_page < last_page && (
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AttacksTable;
