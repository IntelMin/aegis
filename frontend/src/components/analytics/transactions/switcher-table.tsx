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

const TableSwitcher = ({ tables }: { tables: any[] }) => {
  const [activeGraphName, setActiveGraphName] = useState(tables[0].name);

  const ActiveGraphComponent = useMemo(() => {
    const activeGraph = tables.find(
      (graph: { name: any }) => graph.name === activeGraphName
    );
    if (!activeGraph || !activeGraph.component) return null;

    const Component = activeGraph.component;
    const props = { ...activeGraph.props };

    return <Component {...props} />;
  }, [activeGraphName, tables]);

  return (
    <div className="flex flex-col gap-5 max-md:w-screen max-md:overflow-x-scroll">
      <div className="flex items-center gap-4">
        {tables.map(graph => (
          <button
            key={graph.name}
            className={`text-[16px] ${
              activeGraphName === graph.name ? 'bg-blue-600' : 'bg-zinc-900'
            } px-3 py-2 text-neutral-100 text-[16px] leading-[20px] font-[400] max-md:w-full hover:bg-blue-600 transition-all ease-in duration-150`}
            onClick={() => setActiveGraphName(graph.name)}
          >
            {graph.name}
          </button>
        ))}
      </div>
      <div className="border border-zinc-900 bg-[#0C0C0C] p-3">
        {ActiveGraphComponent}
      </div>
    </div>
  );
};

export default TableSwitcher;
