import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
} from '@/components/ui/select';
import { BiChevronDown } from 'react-icons/bi';

const graphType = [
  { type: 'Top Holding Wallet', value: 'Top Holding Wallet' },
  { type: 'Order Book', value: 'Order Book' },
];

export const GraphTypeHeader = (props: {
  choosenType: string;
  handleTypeChange: (value: string) => void;
}) => {
  return (
    <div className="relative">
      <Select onValueChange={props.handleTypeChange}>
        <SelectTrigger className="w-[180px] bg-zinc-900 rounded-[4px] outline-none p-2 py-1 text-white">
          <div className="flex justify-between items-center text-sm">
            {props.choosenType}
            <BiChevronDown className="text-neutral-400 text-[28px]" />
          </div>
        </SelectTrigger>
        <SelectContent className="w-[180px] bg-zinc-900 text-white pointer rounded-[4px] overflow-auto">
          <SelectGroup>
            {graphType.map((item, i) => (
              <SelectItem
                key={i}
                className="p-2 pl-3 outline-none cursor-pointer hover:bg-zinc-800"
                value={item.type}
              >
                {item.type}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
