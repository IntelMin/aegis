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
  results: {
    attacks: any[];
    total: number;
    offset: number;
    pages: number;
    results: any[];
  };
  setLimit: any;
  setOffset: any;
  limit: any;
  offset: any;
}

const AttacksTable: FC<AttacksTableProps> = ({
  loading,
  options,
  results,
  setLimit,
  setOffset,
  limit,
  offset,
}) => {
  const current_page = results?.offset + 1;
  const last_page = results?.pages;

  const handleNextClick = (page: number) => {
    const newOffset = offset + 1;
    setOffset(newOffset);
  };
  const handlePreviousClick = (page: number) => {
    const newOffset = offset - 1;
    setOffset(newOffset);
  };

  const handleClick = (page: number) => {
    const newOffset = offset;
    setOffset(newOffset);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-96">
        <GridLoader color="white" />
      </div>
    );
  }
  return (
    <div className="pt-6 pl-2">
      <div className="flex flex-col pl-4 pt-1">
        {results.attacks.map((attack: any, index: number) => (
          <div
            key={index}
            className="border border-zinc-800 p-4 mb-6 rounded-lg"
          >
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

      <Pagination className="mt-4">
        <PaginationContent>
          {current_page > 1 && (
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => handlePreviousClick(current_page - 1)}
              />
            </PaginationItem>
          )}

          {Array.from({ length: last_page }).map((_, index) => {
            const page = index + 1;
            const isActive = page === current_page;
            if (
              page === current_page ||
              page === current_page - 1 ||
              page === current_page + 1
            ) {
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    className={`cursor-pointer ${
                      isActive ? 'bg-zinc-800' : ''
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            return null;
          })}

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          {current_page < last_page && (
            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => handleNextClick(current_page + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AttacksTable;
