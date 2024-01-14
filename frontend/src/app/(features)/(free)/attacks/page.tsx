'use client';

import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import { useToast } from '@/components/ui/use-toast';
import PulseLoader from 'react-spinners/PulseLoader';
import AttacksFilter from '@/components/attacks/filter';
import AttacksTable from '@/components/attacks/table';
import Banner from '@/components/attacks/banner';
import CountUp from 'react-countup';

interface AttacksProps {}

const Attacks: FC<AttacksProps> = ({}) => {
  const toast = useToast();
  const [fromDate, setFromDate] = useState<Date>();
  const [filterOptions, setFilterOptions] = useState<any[]>([]);
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

    console.log('--------');
    console.log(filterOptions);

    const queryString = qs.stringify(filterOptions, {
      arrayFormat: 'comma',
      skipNulls: true,
    });

    console.log(queryString);
    try {
      const response = await axios.get(`api/attacks/filter?${queryString}`);
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
        <div className="flex gap-2">
          {isInitialLoad ? (
            <div className="flex justify-center items-center w-full">
              <PulseLoader color="white" />
            </div>
          ) : (
            <>
              <AttacksFilter
                onApplyFilters={handleApplyFilters}
                stats={attackStats}
              />

              <main className="flex flex-1 flex-col gap-4 pt-4 pl-4 md:gap-8 md:pt-6">
                <AttacksTable
                  loading={isLoading}
                  options={filterOptions}
                  results={filterResults}
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
