'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import qs from 'qs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { SelectTrigger } from '@radix-ui/react-select';
import { BiChevronDown } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { BountyCard } from '@/components/bounty/card';
import { showToast } from '@/components/toast';
import axios from 'axios';
import PulseLoader from 'react-spinners/PulseLoader';
import GridLoader from 'react-spinners/GridLoader';
import { filterSchema } from '@/components/bounty/schema';

const categoryList = [
  'Bug bounty',
  'Asset Management',
  'Oracle',
  'Synthetic Assets',
  'Stablecoin',
];

type Props = {};

const Bounty = (props: Props) => {
  const [isPaid, setIsPaid] = useState(false);
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<string | undefined>();
  const [language, setLanguage] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();

  const [filterOptions, setFilterOptions] = useState<any[]>([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [filterResults, setFilterResults] = useState<{
    bounties: any[];
    total: number;
    offset: number;
    pages: number;
    results: any[];
  }>({ bounties: [], total: 0, offset: 0, pages: 0, results: [] });
  const [bountyStats, setBountyStats] = useState<{
    total: number;
    total_amount: number;
  }>({ total: 0, total_amount: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const current_page = filterResults?.offset + 1;
  const last_page = filterResults?.pages;

  const handleNextClick = (page: number) => {
    const newOffset = offset + 1;
    setOffset(newOffset);
  };
  const handlePreviousClick = (page: number) => {
    const newOffset = offset - 1;
    setOffset(newOffset);
  };
  useEffect(() => {
    axios.get(`api/bounty/stats`).then(response => {
      setBountyStats(response.data);
      setIsInitialLoad(false);
    });
  }, []);

  const fetchData = async (filterOptions: any) => {
    setIsLoading(true);

    const queryString = qs.stringify(
      { ...filterOptions, isPaid, limit, offset },
      { arrayFormat: 'comma', skipNulls: true }
    );

    try {
      const response = await axios.get(`api/bounty/filter?${queryString}`);
      setFilterResults(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast({
        type: 'error',
        message: 'Error',
        description: 'There was an error fetching the data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilters = (filters: any) => {
    setFilterOptions(filters);
    fetchData(filters);
  };

  const handleApplyFilters = () => {
    const filters = filterSchema.parse({
      name,
      platform,
      language,
      category,
      isPaid,
    });
    handleFilters(filters);
  };
  const resetFilters = () => {
    setName('');
    setPlatform(undefined);
    setLanguage(undefined);
    setCategory(undefined);
    setIsPaid(false);
  };

  const handleResetFilters = () => {
    const initialFilters = filterSchema.parse({});
    resetFilters();
    handleFilters(initialFilters);
  };

  useEffect(() => {
    handleApplyFilters();
    console.log(filterOptions);
  }, [isPaid, platform, language, category, name]);

  useEffect(() => {
    fetchData(filterOptions);
  }, [filterOptions, offset, limit]);

  return (
    <div className="flex flex-col w-full monitor">
      {/* Banner Section */}
      <div
        className="flex flex-col relative py-16 text-center items-center justify-center gap-14 w-full monitor"
      
      >
        <div className="absolute w-[311px] top-0 left-1/2 -translate-y-[50%] -translate-x-1/2 h-[311px] rounded-full bg-[#0E76FD] blur-[200px]" />
        <div className="flex flex-col gap-4">
          <h1 className="text-zinc-50 text-[40px] font-bold">Bug Bounty</h1>
          <p className="text-zinc-300 text-[20px] font-medium">
            Over{' '}
            <span>
              {!isInitialLoad
                ? Math.floor(bountyStats?.total / 100) * 100
                : '...'}
            </span>{' '}
            Bounties aggregated from
          </p>
        </div>
        <div className="flex gap-12 items-center">
          <div>
            <Image
              alt="image"
              src="/icons/bounty/certik.svg"
              width={100}
              height={50}
            />
          </div>
          <div>
            <Image
              alt="image"
              src="/icons/bounty/hackenproof.svg"
              width={100}
              height={50}
            />
          </div>
          <div>
            <Image
              alt="image"
              src="/icons/bounty/immunef.svg"
              width={100}
              height={50}
            />
          </div>
        </div>
      </div>
      <div className="px-6 pt-4 overflow-hidden h-full md:px-10 flex flex-col gap-6 monitor">
        {/* Filter Section */}
        <div className="w-full flex max-md:flex-col max-md:gap-6 items-center justify-between">
          {/* Left Filter Section */}
          <div className="max-md:w-full md:w-[25%] flex gap-3 max-md:justify-center items-center">
            <div
              className="flex gap-3 items-center cursor-pointer"
              onClick={() => setIsPaid(false)}
            >
              <div className="flex items-center justify-center w-4 h-4 border bg-zinc-900 border-zinc-600 rounded-full">
                {!isPaid && (
                  <div className={`w-2 h-2 bg-zinc-50 rounded-full z-2`}></div>
                )}
              </div>
              <p className="text-neutral-200 text-sm font-bold">Open Bounty</p>
            </div>
            <div
              className="flex gap-3 items-center cursor-pointer"
              onClick={() => setIsPaid(true)}
            >
              <div className="flex items-center justify-center w-4 h-4 border bg-zinc-900 border-zinc-600 rounded-full">
                {isPaid && (
                  <div className={`w-2 h-2 bg-zinc-50 rounded-full z-2`}></div>
                )}
              </div>
              <p className="text-neutral-200 text-sm font-bold">Paid Bounty</p>
            </div>
          </div>
          {/* Right Filter Section */}
          <div className="max-md:w-full md:w-[75%] md:justify-end flex max-md:flex-col items-center gap-3">
            {/* Search */}
            <div className="max-md:w-full flex md:flex-grow bg-zinc-900 border border-zinc-800 py-2 max-md:px-2 md:pl-2 md:pr-4 gap-4 md:min-w-[300px] w-fit rounded-md">
              <Image
                src="/icons/search.svg"
                alt="token"
                width={28}
                height={28}
              />
              <input
                type="text"
                autoComplete="off"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Search bounty"
                className="flex-grow text-[15px] text-white placeholder:text-zinc-200 border-none outline-none bg-transparent"
              />
            </div>
            <div className="grid grid-cols-4 md:max-w-[60%] max-md:w-full items-center gap-3">
              {/* Dropdown Filter */}
              <Select onValueChange={value => setPlatform(value)}>
                <SelectTrigger className="col-span-2 md:col-span-1 md:w-full text-zinc-500 bg-zinc-900 py-2 pl-[3px] rounded-md">
                  <div className="flex gap-4 item-center justify-center font-semibold text-sm translate-y-1">
                    <SelectValue placeholder="Platform" />
                    <BiChevronDown className="text-zinc-100 text-[28px] -translate-y-1" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="*">All</SelectItem>
                    <SelectItem value="certik">
                      <div className="flex flex-row">
                        <Image
                          src="/icons/bounty/certik.png"
                          alt="token"
                          width={16}
                          height={16}
                          className="mr-2"
                        />
                        <span>Certik</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="hackenproof">
                      <div className="flex flex-row">
                        <Image
                          src="/icons/bounty/hackenproof.png"
                          alt="token"
                          width={16}
                          height={16}
                          className="mr-2"
                        />
                        <span>HackenProof</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="immunefi">
                      <div className="flex flex-row">
                        <Image
                          src="/icons/bounty/immunefi.png"
                          alt="token"
                          width={16}
                          height={16}
                          className="mr-2"
                        />
                        <span>Immunefi</span>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select onValueChange={value => setLanguage(value)}>
                <SelectTrigger className="col-span-2 md:col-span-1 md:w-full text-zinc-500 bg-zinc-900 p-2 pl-3 rounded-md">
                  <div className="flex gap-2 item-center justify-center  font-semibold text-sm translate-y-1">
                    <SelectValue placeholder="Language" />
                    <BiChevronDown className="text-zinc-100 text-[28px] -translate-y-1" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="*">All</SelectItem>
                    <SelectItem value="Solidity">
                      <div className="flex flex-row">
                        <span>Solidity</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Rust">
                      <div className="flex flex-row">
                        <span>Rust</span>
                      </div>
                    </SelectItem>

                    <SelectItem value="Vyper">
                      <div className="flex flex-row">
                        <span>Vyper</span>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select onValueChange={value => setCategory(value)}>
                <SelectTrigger className="col-span-2 md:col-span-1 md:w-full text-zinc-500 bg-zinc-900 p-2 pl-3 rounded-md">
                  <div className="flex gap-2 item-center justify-center  font-semibold text-sm translate-y-1">
                    <SelectValue placeholder="Category" />
                    <BiChevronDown className="text-zinc-100 text-[28px] -translate-y-1" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="*">All</SelectItem>
                    {categoryList?.map((category: any) => (
                      <SelectItem value={category} key={category}>
                        <div className="flex flex-row">
                          <span>{category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                className="col-span-2 md:col-span-1 p-2 h-full flex items-center gap-2 text-zinc-500"
                onClick={handleResetFilters}
                style={{
                  background: '#09090B',
                }}
              >
                <Image
                  src="/icons/bounty/close.svg"
                  alt="close"
                  width={16}
                  height={16}
                />
                <h1 className="z-2 text-zinc-500 font-semibold text-sm">
                  Reset
                </h1>
              </Button>
            </div>
          </div>
        </div>

        {/* Bounty Card */}
        {isInitialLoad ? (
          <div className="flex justify-center items-center w-full">
            <PulseLoader color="white" />
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center w-full h-96">
                <GridLoader color="white" />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-6 my-6 max-md:my-3 bounty">
                {filterResults.bounties?.map((item, i) => (
                  <BountyCard i={i} key={item} bounty={item} />
                ))}
              </div>
            )}

            {/* Pagnation */}
            <div className="w-full flex justify-center items-center pb-12">
              <Pagination className="mt-4">
                <PaginationContent>
                  {current_page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        className="cursor-pointer bg-[#121F31]"
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
                              isActive ? 'bg-[#0E76FD]' : ''
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
                        className="cursor-pointer bg-[#0E76FD]"
                        onClick={() => handleNextClick(current_page + 1)}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Bounty;
