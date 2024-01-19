'use client';

import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import dynamic from 'next/dynamic';
import PulseLoader from 'react-spinners/PulseLoader';
import GridLoader from 'react-spinners/GridLoader';
// import AttacksFilter from '@/components/attacks/filter';
// import AttacksTable from '@/components/attacks/table';
import Banner from '@/components/attacks/banner';
import CountUp from 'react-countup';
import { Button } from '@/components/ui/button';
import { FaFilter } from 'react-icons/fa6';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { showToastError } from '@/components/toast-error';

const AttacksTable = dynamic(() => import('@/components/attacks/table'), {
  loading: () => <GridLoader color="white" />,
});

const AttacksFilter = dynamic(() => import('@/components/attacks/filter'), {
  loading: () => <GridLoader color="white" />,
});

interface AttacksProps {}

const Attacks: FC<AttacksProps> = ({}) => {
  const [filterOptions, setFilterOptions] = useState<any[]>([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [filterResults, setFilterResults] = useState<{
    attacks: any[];
    total: number;
    offset: number;
    pages: number;
    results: any[];
  }>({ attacks: [], total: 0, offset: 0, pages: 0, results: [] });
  const [attackStats, setAttackStats] = useState<{
    total: number;
    total_amount: number;
  }>({ total: 0, total_amount: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    axios.get(`api/attacks/stats`).then(response => {
      setAttackStats(response.data);
      setIsInitialLoad(false);
    });
  }, []);

  const fetchData = async (filterOptions: any[]) => {
    setIsLoading(true);

    const queryString = qs.stringify(
      { ...filterOptions, limit, offset },
      { arrayFormat: 'comma', skipNulls: true }
    );

    try {
      const response = await axios.get(`api/attacks/filter?${queryString}`);
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
    <div>
      <Banner />
      <div className="flex justify-center items-center w-full">
        <div className="mt-10 justify-center items-center w-full">
          <div className="p-4 text-center mix-blend-difference">
            <h1 className="font-bold text-[32px] text-zinc-200">
              {!isInitialLoad ? (
                <CountUp
                  start={0}
                  end={attackStats?.total_amount}
                  duration={2.75}
                  separator=","
                  decimals={2}
                  decimal="."
                />
              ) : (
                <>...</>
              )}
            </h1>
            <h2 className="text-sm text-zinc-500 uppercase">
              stolen in{' '}
              <span className="font-bold text-zinc-400">
                {!isInitialLoad ? (
                  <>{attackStats?.total?.toLocaleString('en-US')}</>
                ) : (
                  <>...</>
                )}
              </span>{' '}
              attacks
            </h2>
          </div>
        </div>
      </div>

      <div className="p-8 w-full max-w-[900px] m-auto">
        <div className="flex max-md:flex-col gap-2">
          {isInitialLoad ? (
            <div className="flex justify-center items-center w-full">
              <PulseLoader color="white" />
            </div>
          ) : (
            <>
              <div>
                <div className="w-full md:hidden flex justify-end">
                  <Dialog>
                    <DialogTrigger>
                      <Button className="text-sm bg-white flex items-center gap-2">
                        <FaFilter />
                        Filters
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90%]">
                      <AttacksFilter
                        onApplyFilters={handleApplyFilters}
                        stats={attackStats}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="max-md:hidden">
                  <AttacksFilter
                    onApplyFilters={handleApplyFilters}
                    stats={attackStats}
                  />
                </div>
              </div>

              <main className="flex flex-1 flex-col gap-4 pt-4 md:pl-4 md:gap-8 md:pt-6">
                <AttacksTable
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
    </div>
  );
};

export default Attacks;
