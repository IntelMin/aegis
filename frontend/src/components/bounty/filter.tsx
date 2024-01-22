'use client';

import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { format, set } from 'date-fns';
import { cn } from '@/lib/utils';
import { filterSchema } from './schema';
import { formatNumber } from '@/utils/format-number';

interface BountyFilterProps {
  onApplyFilters: (filters: any) => void;
  stats: any;
}

const categoryList = [
  'Bug bounty',
  'Asset Management',
  'Oracle',
  'Synthetic Assets',
  'Stablecoin',
];

const BountyFilter: FC<BountyFilterProps> = ({ onApplyFilters, stats }) => {
  const [name, setName] = useState<string | undefined>();
  const [platform, setPlatform] = useState<string | undefined>();
  const [language, setLanguage] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [funds, setFunds] = useState(0);
  const [bounty, setBounty] = useState<number | undefined>();
  const [isPaid, setIsPaid] = useState<boolean | undefined>();

  const handleApplyFilters = () => {
    const filters = filterSchema.parse({
      name,
      platform,
      language,
      category,
      fromDate,
      toDate,
      funds,
      bounty,
      isPaid,
    });
    onApplyFilters(filters);
  };

  const resetFilters = () => {
    setName(undefined);
    setPlatform(undefined);
    setLanguage(undefined);
    setCategory(undefined);
    setFromDate(undefined);
    setToDate(undefined);
    setFunds(0);
    setBounty(undefined);
    setIsPaid(undefined);
  };

  const handleResetFilters = () => {
    const initialFilters = filterSchema.parse({});
    resetFilters();
    onApplyFilters(initialFilters);
  };

  return (
    <nav className="flex flex-col py-5 px-5 border-r border-zinc-900 text-sm font-medium gap-3">
      <h1>Filter</h1>

      <div
        className="flex border rounded-md border-zinc-800 py-2 max-md:px-2 md:pl-2 md:pr-4 gap-2  w-full"
        onClick={() => {}}
      >
        <Image src="/icons/search.svg" alt="token" width={16} height={16} />
        <input
          type="text"
          autoComplete="off"
          placeholder="Search Project"
          className=" max-md:hidden placeholder:text-neutral-600 border-none outline-none bg-transparent"
          onChange={e => setName(e.target.value)}
          value={name || ''}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform">Platform</Label>
        <Select>
          <SelectTrigger className="w-full text-zinc-500">
            <SelectValue placeholder="Select a platform" />
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform">Language</Label>
        <Select onValueChange={setLanguage}>
          <SelectTrigger className="w-full text-zinc-500">
            <SelectValue placeholder="Select a language" />
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform">Category</Label>
        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-full text-zinc-500">
            <SelectValue placeholder="Select a category" />
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
      </div>

      <div className="space-y-2 flex flex-col">
        <Label htmlFor="platform">From</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !fromDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? (
                format(fromDate, 'PPP')
              ) : (
                <span className="text-zinc-500">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={setFromDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2 flex flex-col">
        <Label htmlFor="platform">To</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !toDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? (
                format(toDate, 'PPP')
              ) : (
                <span className="text-zinc-500">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={setToDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* <div className="space-y-2 pb-3">
        <div className="flex justify-between">
          <Label htmlFor="platform">Funds</Label>
          <span className="text-xs text-zinc-500 flex-end">
            {formatNumber(funds)}
          </span>
        </div>
        <Slider
          defaultValue={[0, 0]}
          max={stats.max_reward}
          step={100}
          onValueChange={(values: number[]) => {
            if (values.length === 1) {
              setFunds(values[0]);
            }
          }}
        />
      </div> */}

      <div className="space-y-2 pb-3">
        <div className="flex justify-between">
          <Label htmlFor="platform">Bounty</Label>
          <span className="text-xs text-zinc-500 flex-end">
            {bounty ? formatNumber(bounty) : 0}
          </span>
        </div>

        <Slider
          defaultValue={[1000]}
          onValueChange={(values: number[]) => {
            if (values.length === 1) {
              setBounty(values[0]);
            }
          }}
          max={10000000}
          step={10000}
        />
      </div>

      <div className="flex items-center space-x-2 pb-3">
        <Switch onCheckedChange={() => setIsPaid(!isPaid)} id="airplane-mode" />
        <Label htmlFor="airplane-mode">Paid</Label>
      </div>

      <Button onClick={handleApplyFilters}>Filter</Button>
      <Button variant="outline" onClick={handleResetFilters}>
        Reset
      </Button>
    </nav>
  );
};

export default BountyFilter;
