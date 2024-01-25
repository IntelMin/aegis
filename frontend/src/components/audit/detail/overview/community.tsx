import React, { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import SecurityScale from '@/components/analytics/overview/security-scale';
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Props } from 'react-apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
}) as React.FC<Props>;

interface CommunityInfoProps {
  contractAddress: string;
}

const CommunityInfo: React.FC<CommunityInfoProps> = ({ contractAddress }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`w-full bg-[#0C0C0C] p-3 border border-zinc-900 transition-all duration-300 ${
        isExpanded ? 'h-full' : 'h-14'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-row align-center">
          <h1 className="text-xl font-semibold w-[120px]">Community</h1>
          <div className="translate-y-1">
            <SecurityScale value={80} />
          </div>
        </div>
        <button
          className="text-zinc-400 hover:text-zinc-200"
          onClick={toggleExpansion}
        >
          {isExpanded ? (
            <ChevronUpIcon className="w-6 h-6" />
          ) : (
            <ChevronDownIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {isExpanded && <div className="grid grid-cols-4 gap-4 mt-3 "></div>}
    </div>
  );
};

export default CommunityInfo;
