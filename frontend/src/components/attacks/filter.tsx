'use client';

import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

interface AttacksFilterProps {
  onApplyFilters: (filters: any) => void;
  stats: any;
}

const AttacksFilter: FC<AttacksFilterProps> = ({ onApplyFilters, stats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [platform, setPlatform] = useState<string | undefined>();
  const [language, setLanguage] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [funds, setFunds] = useState(0);
  const [bounty, setBounty] = useState(0);
  const [isPaid, setIsPaid] = useState(false);

  const handleApplyFilters = () => {
    const filters = filterSchema.parse({
      searchTerm,
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

  const handleResetFilters = () => {
    setSearchTerm('');
    setPlatform(undefined);
    setLanguage(undefined);
    setCategory(undefined);
    setFromDate(undefined);
    setToDate(undefined);
    setFunds(0);
    setBounty(0);
    setIsPaid(false);
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
          placeholder="Search..."
          className=" max-md:hidden placeholder:text-neutral-600 border-none outline-none bg-transparent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform">Category</Label>
        <Select>
          <SelectTrigger className="w-full text-zinc-500">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="*">All</SelectItem>
              {stats.categories?.map((category: any) => (
                <SelectItem value={category.name} key={category.name}>
                  <div className="flex flex-row">
                    <span>{category.name}</span>
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

      <div className="space-y-2 flex flex-col pb-3">
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

      <Button onClick={handleApplyFilters}>Filter</Button>
      <Button variant="outline" onClick={handleResetFilters}>
        Reset
      </Button>
    </nav>
  );
};

export default AttacksFilter;
