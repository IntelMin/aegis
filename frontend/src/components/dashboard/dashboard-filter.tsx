'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

type DrpdownFilterProps = {
  onTimeChange: (time: number) => void;
};

const timeFilter = [
  { time: '1 hr', value: 60 },
  { time: '4 hr', value: 60 * 4 },
  { time: '12 hr', value: 60 * 12 },
  // { time: '1 day', value: 60 * 24 },
];

const DropdownFilter = ({ onTimeChange }: DrpdownFilterProps) => {
  const [tableType, setTableType] = useState('Trending');
  const [choosenTime, setChoosenTime] = useState(0);

  useEffect(() => {
    onTimeChange(timeFilter[Number(choosenTime)].value);
  }, [choosenTime, onTimeChange]);

  return (
    <div className="relative flex max-md:flex-col max-md:gap-4 md:items-center justify-between mt-10 md:mb-4">
      <div className="text-white">
        <div className="relative min-w-[120px]">
          <button className="flex items-center gap-2">
            <p className="text-neutral-200 text-[20px]">{tableType}</p>
            <p className="w-[12px] h-[12px] rounded-full bg-green-400 animate-pulse"></p>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative max-md:w-1/2 ">
          <Select onValueChange={value => setChoosenTime(Number(value))}>
            <SelectTrigger className="w-full md:w-[150px] max-md:px-4 bg-zinc-900 rounded-[4px] outline-none p-2 text-white">
              <div className="flex items-center justify-between ">
                {timeFilter[choosenTime].time}
              </div>
            </SelectTrigger>

            <SelectContent className="bg-zinc-900 text-white pointer rounded-[4px] overflow-auto">
              <SelectGroup>
                {timeFilter.map((item, i) => (
                  <SelectItem
                    key={i}
                    className="p-2 pl-3 outline-none cursor-pointer hover:bg-zinc-800"
                    value={String(i)}
                  >
                    {item.time}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DropdownFilter;
