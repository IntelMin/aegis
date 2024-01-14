import { FC, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

interface BountyTableProps {
  loading: boolean;
  options: any[];
  results: any[];
}

const BountyTable: FC<BountyTableProps> = ({ loading, options, results }) => {
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
      <Table className="border border-zinc-800 w-full">
        <TableHeader className="grid grid-cols-6 bg-zinc-800">
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Project
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Bounty
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Payout
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Added
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Updated
          </TableHead>
          <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
            Paid
          </TableHead>
        </TableHeader>
        <TableBody>
          {results.bounties.map((bounty: any) => (
            <TableRow
              key={bounty.id}
              className="grid grid-cols-6 items-center border-b-1"
            >
              <TableCell className="text-neutral-100 text-center flex items-center justify-right">
                <img
                  src={bounty.logo}
                  alt={bounty.name}
                  className="w-8 h-8 mr-2"
                />
                <div className="flex">
                  <a
                    href={bounty.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-200 text-xs text-left"
                  >
                    {bounty.name}
                  </a>
                </div>
              </TableCell>
              <TableCell className="py-2 px-4 text-neutral-200 text-center">
                {formatNumber(bounty.max_reward)}
              </TableCell>
              <TableCell className="py-2 px-4 text-neutral-200 text-center">
                {bounty.total_paid_amount > 0
                  ? formatNumber(bounty.total_paid_amount)
                  : '-'}
              </TableCell>
              <TableCell className="py-2 px-4 text-neutral-200 text-center">
                {formatAge(new Date(bounty.date).getTime())}
              </TableCell>
              <TableCell className="py-2 px-4 text-neutral-200 text-center">
                {formatAge(new Date(bounty.last_updated_date).getTime())}
              </TableCell>
              <TableCell className="py-2 px-4 text-neutral-200 text-center">
                {bounty.total_paid_metric_enabled ? 'Yes' : 'No'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

export default BountyTable;
