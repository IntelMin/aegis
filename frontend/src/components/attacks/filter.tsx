'use client';

import { FC, use, useState } from 'react';
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

const attackVectorList = [
  'Rug Pull',
  'Social Engineering',
  'Twitter',
  'Price Manipulation',
  'Contract Vulnerability',
  'Unknown',
];

const AttacksFilter: FC<AttacksFilterProps> = ({ onApplyFilters, stats }) => {
  const [target, setTarget] = useState<string | undefined>();
  const [attackVector, setAttackVector] = useState<string | undefined>();
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const handleApplyFilters = () => {
    const filters = filterSchema.parse({
      target,
      attackVector,
      fromDate,
      toDate,
    });

    onApplyFilters(filters);
  };

  const resetFilters = () => {
    setTarget(undefined);
    setAttackVector(undefined);
    setFromDate(undefined);
    setToDate(undefined);
  };

  const handleResetFilters = () => {
    const initialFilters = filterSchema.parse({});
    resetFilters();
    onApplyFilters(initialFilters);
  };

  return (
    <nav className="flex flex-col py-5 px-5 max-md:border-r-0 border-r border-zinc-900 text-sm font-medium gap-3">
      <h1>Filter</h1>

      <div
        className="flex border rounded-md border-zinc-800 py-2 max-md:px-2 max-md:pr-2 md:pl-2 md:pr-4 gap-2  w-full"
        onClick={() => {}}
      >
        <Image src="/icons/search.svg" alt="token" width={16} height={16} />
        <input
          type="text"
          autoComplete="off"
          placeholder="Search target"
          onChange={e => setTarget(e.target.value)}
          value={target || ''}
          className=" max-md:hidden placeholder:text-neutral-600 border-none outline-none bg-transparent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform">Attack Vector</Label>
        <Select onValueChange={setAttackVector}>
          <SelectTrigger className="w-full text-zinc-500">
            {attackVector || 'Select attack vector'}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="*">All</SelectItem>
              {attackVectorList?.map((vector: any, index) => (
                <SelectItem value={vector} key={index}>
                  <div className="flex flex-row">
                    <span>{vector}</span>
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
