import React, { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '@/components/ui/select';
import { BiChevronDown } from 'react-icons/bi';

const DropdownSwitcher = ({
  graphs,
  defaultResolution,
}: {
  graphs: any[];
  defaultResolution: string;
}) => {
  const [activeGraphName, setActiveGraphName] = useState(graphs[0].name);
  const [resolution, setResolution] = useState(defaultResolution);

  const resolutionFilter = ['6M', '1M', '1W', '1D'];

  const ActiveGraphComponent = useMemo(() => {
    const activeGraph = graphs.find(
      (graph: { name: any }) => graph.name === activeGraphName
    );
    if (!activeGraph || !activeGraph.component) return null;

    const Component = activeGraph.component;
    const props = activeGraph.props || {};

    return <Component {...props} />;
  }, [activeGraphName, graphs]);

  const handleResolutionChange = (value: string) => {
    setResolution(value);
    console.log(value);
  };

  return (
    <div className="flex flex-col gap-6 p-3 border border-zinc-900 bg-[#0C0C0C]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select onValueChange={value => setActiveGraphName(value)}>
            <SelectTrigger className="bg-zinc-900 rounded-[4px] outline-none p-2 py-1 text-white">
              {activeGraphName}
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 text-white pointer rounded-[4px] overflow-auto">
              <SelectGroup>
                {graphs.map((graph, i) => (
                  <SelectItem
                    key={i}
                    className="p-2 pl-3 outline-none cursor-pointer hover:bg-zinc-800"
                    value={graph.name}
                  >
                    {graph.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="relative z-20">
          <Select onValueChange={handleResolutionChange}>
            <SelectTrigger className="w-[60px] bg-zinc-900 rounded-[4px] outline-none p-2 py-1 text-white">
              <div className="flex items-center justify-between text-sm">
                {resolution}
                <BiChevronDown className="text-neutral-400 text-[28px]" />
              </div>
            </SelectTrigger>
            <SelectContent className="w-[60px] bg-zinc-900 text-white pointer rounded-[4px] overflow-auto">
              <SelectGroup>
                {resolutionFilter.map((item, i) => (
                  <SelectItem
                    key={i}
                    className="p-2 pl-3 outline-none cursor-pointer hover:bg-zinc-800"
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {ActiveGraphComponent}
    </div>
  );
};

export default DropdownSwitcher;
