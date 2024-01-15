'use client';

import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import { useToast } from '@/components/ui/use-toast';
import PulseLoader from 'react-spinners/PulseLoader';
import Image from 'next/image';
import BountyFilter from '@/components/bounty/filter';
import BountyTableProps from '@/components/bounty/table';

interface BountyProps {}

const Bounty: FC<BountyProps> = ({}) => {
  const toast = useToast();
  const [fromDate, setFromDate] = useState<Date>();
  const [filterOptions, setFilterOptions] = useState<any[]>([]);
  const [filterResults, setFilterResults] = useState<{
    bounties: any[];
    total: number;
    offset: number;
    pages: number;
  }>({ bounties: [], total: 0, offset: 0, pages: 0 });
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

    console.log('--------');
    console.log(filterOptions);

    const queryString = qs.stringify(filterOptions, {
      arrayFormat: 'comma',
      skipNulls: true,
    });

    console.log(queryString);
    try {
      const response = await axios.get(`api/bounty/filter?${queryString}`);
      setFilterResults(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.toast({
        variant: 'destructive',
        title: 'Error',
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
  }, [filterOptions]);

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
        <div className="flex gap-2">
          {isInitialLoad ? (
            <div className="flex justify-center items-center w-full">
              <PulseLoader color="white" />
            </div>
          ) : (
            <>
              <div className="max-md:hidden">
                <BountyFilter
                  onApplyFilters={handleApplyFilters}
                  stats={bountyStats}
                />
              </div>

              <main className="flex flex-1 flex-col gap-4 pt-4 max-md:px-4 md:pl-4 md:gap-8 md:pt-6 max-md:w-full">
                <BountyTableProps
                  loading={isLoading}
                  options={filterOptions}
                  results={filterResults}
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
