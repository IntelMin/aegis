'use client';

import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import PulseLoader from 'react-spinners/PulseLoader';
import Image from 'next/image';
import GridLoader from 'react-spinners/GridLoader';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FaFilter } from 'react-icons/fa6';
import { showToastError } from '@/components/toast-error';

const BountyFilter = dynamic(() => import('@/components/bounty/filter'), {
  loading: () => <GridLoader color="white" />,
});

const BountyTable = dynamic(() => import('@/components/bounty/table'), {
  loading: () => <GridLoader color="white" />,
});

interface BountyProps {}

const Bounty: FC<BountyProps> = ({}) => {
  const [fromDate, setFromDate] = useState<Date>();
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
      showToastError({
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

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div className="mt-10 justify-center items-center w-full">
          <div className="p-4 text-center">
            <h1 className="font-bold text-[32px] text-zinc-200 p-1">
              Bug Bounty
            </h1>
            <h2 className="text-sm text-zinc-500 uppercase">
              over{' '}
              <span className="font-bold text-zinc-400">
                {!isInitialLoad
                  ? Math.floor(bountyStats?.total / 100) * 100
                  : '...'}
              </span>{' '}
              bounties
            </h2>
          </div>
          <div className="flex justify-center items-center text-xs text-zinc-400">
            aggregated from
            <div className="flex items-center">
              <Image
                alt="certik"
                src="/icons/bounty/certik.png"
                className="ml-2 mr-2"
                width={24}
                height={24}
              />
              Certik
            </div>
            <div className="flex items-center">
              <Image
                alt="certik"
                src="/icons/bounty/hackenproof.png"
                className="ml-2 mr-2"
                width={24}
                height={24}
              />
              HackenProof
            </div>
            <div className="flex items-center">
              <Image
                alt="certik"
                src="/icons/bounty/immunefi.png"
                className="ml-2 mr-2"
                width={24}
                height={24}
              />
              Immunefi
            </div>
            <div className="flex ml-1">&amp; others</div>
          </div>
        </div>
      </div>

      <div className="p-8 w-full max-w-[1200px] m-auto">
        <div className="flex max-md:flex-col gap-2">
          {isInitialLoad ? (
            <div className="flex justify-center items-center w-full">
              <PulseLoader color="white" />
            </div>
          ) : (
            <>
              <div className="">
                <div className="w-full md:hidden flex justify-end">
                  <Dialog>
                    <DialogTrigger>
                      <Button className="text-sm bg-white flex items-center gap-2">
                        <FaFilter />
                        Filters
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90%]">
                      <BountyFilter
                        onApplyFilters={handleApplyFilters}
                        stats={bountyStats}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="max-md:hidden">
                  <BountyFilter
                    onApplyFilters={handleApplyFilters}
                    stats={bountyStats}
                  />
                </div>
              </div>

              <main className="flex flex-1 flex-col gap-4 pt-4 pl-4 md:gap-8 md:pt-6">
                <BountyTable
                  loading={isLoading}
                  options={filterOptions}
                  results={filterResults}
                  setLimit={setLimit}
                  setOffset={setOffset}
                  limit={limit}
                  offset={offset}
                />
              </main>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Bounty;
