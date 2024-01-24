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
  const [isExpanded, setIsExpanded] = useState(true);

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

      {isExpanded && (
        <div className="grid grid-cols-4 gap-4 mt-3 ">
          <TooltipProvider>
            <div className="col-span-1">
              <div className="p-4 rounded-md bg-zinc-900">
                <p className="text-2xl font-mono">4,478</p>
                <h2 className="text-lg text-zinc-300 font-semibold">Holders</h2>
              </div>
            </div>

            <div className="col-span-1">
              <div className="p-4 rounded-md bg-zinc-900 relative">
                <Tooltip>
                  <TooltipTrigger className="absolute right-4">
                    <InfoIcon />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      The Gini coefficient is a measure of inequality in a
                      distribution.{' '}
                    </p>
                    <p>
                      It is a number between 0 and 1, with 0 representing{' '}
                      perfect equality and 1 representing perfect inequality.
                    </p>
                  </TooltipContent>
                </Tooltip>
                <p className="text-2xl font-mono">4,478</p>
                <h2 className="text-lg text-zinc-300">Gini Coefficient</h2>
              </div>
            </div>

            <div className="col-span-1">
              <div className="p-4 rounded-md bg-zinc-900 relative">
                <Tooltip>
                  <TooltipTrigger className="absolute right-4">
                    <InfoIcon />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      The Nakamoto coefficient is a measure of the
                      centralization of a blockchain network.
                    </p>
                    <p>
                      It is calculated by counting the number of holders that
                      together control more than 51% of the total supply of a
                      token.
                    </p>
                    <p>The default value is 0.51.</p>
                  </TooltipContent>
                </Tooltip>
                <p className="text-2xl font-mono">4,478</p>
                <h2 className="text-lg text-zinc-300">Nakamoto Index</h2>
              </div>
            </div>

            <div className="col-span-1">
              <div className="p-4 rounded-md bg-zinc-900 relative">
                <Tooltip>
                  <TooltipTrigger className="absolute right-4">
                    <InfoIcon />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      The Thiel index is measure of inequality in a
                      distribution.
                    </p>
                    <p>
                      It is calculated by taking the square of the sum of the
                      market shares of all participants in a market.
                    </p>
                  </TooltipContent>
                </Tooltip>
                <p className="text-2xl font-mono">4,478</p>
                <h2 className="text-lg text-zinc-300">Theil Index</h2>
              </div>
            </div>
          </TooltipProvider>

          <div className="col-span-4"></div>
        </div>
      )}
    </div>
  );
};

export default CommunityInfo;
