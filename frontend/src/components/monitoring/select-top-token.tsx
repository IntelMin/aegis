import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
} from '@/components/ui/select';
import { BiChevronDown } from 'react-icons/bi';

const SelectTopToken = () => {
  return (
    <div>
      <Select>
        <SelectTrigger className="w-[130px] bg-zinc-900 rounded-[4px] outline-none p-2 text-white">
          <div className="flex justify-between items-center uppercase">
            Top 100
            <BiChevronDown className="text-neutral-400 text-[28px]" />
          </div>
        </SelectTrigger>
        <SelectContent className="w-[150px] bg-zinc-900 text-white pointer rounded-[4px] h-[400px] overflow-auto">
          <SelectGroup>
            <SelectItem
              className="p-2 pl-3 uppercase outline-none cursor-pointer hover:bg-zinc-800"
              value={'test'}
            >
              <p className="text-white">hello</p>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectTopToken;
