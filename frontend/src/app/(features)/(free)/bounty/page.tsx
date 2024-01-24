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

const categoryList = [
  'Bug bounty',
  'Asset Management',
  'Oracle',
  'Synthetic Assets',
  'Stablecoin',
];

type Props = {};

const Bounty = (props: Props) => {
  const [bounties, setBounties] = React.useState('open');
  const [search, setSearch] = React.useState('');
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

  useEffect(() => {
    axios.get(`api/bounty/stats`).then(response => {
      setBountyStats(response.data);
      setIsInitialLoad(false);
    });
  }, []);

  const fetchData = async (filterOptions: any) => {
    setIsLoading(true);

    const queryString = qs.stringify(
      { ...filterOptions, limit, offset },
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

  const handleApplyFilters = (filters: any) => {
    setFilterOptions(filters);
    fetchData(filters);
  };

  useEffect(() => {
    fetchData(filterOptions);
  }, [filterOptions, offset, limit]);

  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16];

  return (
    <div className="flex flex-col w-full monitor">
      {/* Banner Section */}
      <div
        className="flex flex-col py-24 text-center items-center justify-center gap-14 w-full monitor"
        style={{
          background: 'url(/backgrounds/bounty.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-zinc-50 text-[40px] font-bold">Bug Bounty</h1>
          <p className="text-zinc-300 text-[20px] font-medium">
            Over 400 Bounties aggregated from
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
      <div className="px-2 overflow-hidden h-full md:px-10 flex flex-col gap-6 monitor">
        {/* Filter Section */}
        <div className="w-full flex max-md:flex-col max-md:gap-6 items-center justify-between">
          {/* Left Filter Section */}
          <div className="max-md:w-full flex gap-3 max-md:justify-center items-center">
            <div
              className="flex gap-3 items-center cursor-pointer"
              onClick={() => setBounties('open')}
            >
              <div className="flex items-center justify-center w-4 h-4 border bg-zinc-900 border-zinc-600 rounded-full">
                {bounties === 'open' && (
                  <div className={`w-2 h-2 bg-zinc-50 rounded-full z-2`}></div>
                )}
              </div>
              <p className="text-neutral-200 text-sm font-bold">Open Bounty</p>
            </div>
            <div
              className="flex gap-3 items-center cursor-pointer"
              onClick={() => setBounties('paid')}
            >
              <div className="flex items-center justify-center w-4 h-4 border bg-zinc-900 border-zinc-600 rounded-full">
                {bounties === 'paid' && (
                  <div className={`w-2 h-2 bg-zinc-50 rounded-full z-2`}></div>
                )}
              </div>
              <p className="text-neutral-200 text-sm font-bold">Paid Bounty</p>
            </div>
          </div>
          {/* Right Filter Section */}
          <div className="max-md:w-full flex max-md:flex-col items-center gap-3">
            {/* Search */}
            <div className="max-md:w-full flex bg-zinc-900 border border-zinc-800 py-2 max-md:px-2 md:pl-2 md:pr-4 gap-4 md:min-w-[400px] w-fit rounded-md">
              <Image
                src="/icons/search.svg"
                alt="token"
                width={28}
                height={28}
              />
              <input
                type="text"
                autoComplete="off"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search bounty"
                className="flex-grow text-[15px] text-white placeholder:text-zinc-200 border-none outline-none bg-transparent"
              />
            </div>
            <div className="grid grid-cols-4 max-md:w-full items-center gap-3">
              {/* Dropdown Filter */}
              <Select>
                <SelectTrigger className="col-span-2 md:col-span-1 md:w-full text-zinc-500 bg-zinc-900 p-2 pl-3 rounded-md">
                  <div className="flex gap-2 item-center max-md:justify-center font-semibold text-sm translate-y-1">
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

              <Select>
                <SelectTrigger className="col-span-2 md:col-span-1 md:w-full text-zinc-500 bg-zinc-900 p-2 pl-3 rounded-md">
                  <div className="flex gap-2 item-center max-md:justify-center  font-semibold text-sm translate-y-1">
                    <SelectValue placeholder="Category" />
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

              <Select>
                <SelectTrigger className="col-span-2 md:col-span-1 md:w-full text-zinc-500 bg-zinc-900 p-2 pl-3 rounded-md">
                  <div className="flex gap-2 item-center max-md:justify-center  font-semibold text-sm translate-y-1">
                    <SelectValue placeholder="Language" />
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

            <div className="w-full flex justify-center items-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious className="bg-[#121F31]" href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink className="bg-[#0E76FD] py-1" href="#">
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext className="bg-[#0E76FD] py-1" href="#" />
                  </PaginationItem>
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
