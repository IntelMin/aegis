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

interface GovernanceInfoProps {
  contractAddress: string;
}

const GovernanceInfo: React.FC<GovernanceInfoProps> = ({ contractAddress }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const series = [
    {
      name: 'Marine Sprite',
      data: [44],
    },
    {
      name: 'Striking Calf',
      data: [53],
    },
    {
      name: 'Tank Picture',
      data: [12],
    },
    {
      name: 'Bucket Slope',
      data: [9],
    },
    {
      name: 'Reborn Kid',
      data: [25],
    },
  ];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      stackType: '100%',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0,
            style: {
              fontSize: '13px',
              fontWeight: 900,
            },
          },
        },
      },
    },
    toolbar: {
      show: false,
    },
    stroke: {
      width: 2,
      colors: ['#000'],
    },
    xaxis: {
      categories: [2008],
      labels: {
        formatter: function (val) {
          return val + '%';
        },
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      show: false,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + 'K';
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      offsetX: 40,
    },
  };

  return (
    <div
      className={`w-full bg-[#0C0C0C] p-3 border border-zinc-900 transition-all duration-300 ${
        isExpanded ? 'h-full' : 'h-14'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-row align-center">
          <h1 className="text-xl font-semibold w-[120px]">Governance</h1>
          <div className="translate-y-1">
            <SecurityScale value={43} />
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
          {/* <TooltipProvider>
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

          <div className="col-span-4">
            <Chart
              options={options}
              series={series}
              type="bar"
              stacked={true}
              width={'100%'}
              height={300}
            />
          </div> */}
          {/* <div className="col-span-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 p-4 border border-blue-700 rounded-md">
                <h2 className="text-lg">Top 10 Holders</h2>
                <p className="text-2xl">24%</p>
              </div>
              <div className="col-span-1 p-4 border border-blue-700 rounded-md">
                <h2 className="text-lg">Team Percentage</h2>
                <p className="text-2xl">3%</p>
              </div>
            </div>
            <div className="p-4 border border-blue-700 rounded-md">
              <h2 className="text-lg">Holder</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>1 - 0xfe73...59bb</span>
                  <span>...</span>
                </div>
                <div className="flex justify-between">
                  <span>2 - 0x5f30...57ea</span>
                  <span>...</span>
                </div>
                <div className="flex justify-between">
                  <span>3 - 0xaf8c...da46</span>
                  <span>...</span>
                </div>
              </div>
              <h2 className="text-lg mt-4">Share</h2>
              <div className="w-full bg-blue-800 h-6 rounded-md"></div>
              <div className="w-3/4 bg-blue-800 h-6 rounded-md"></div>
              <div className="w-1/2 bg-blue-800 h-6 rounded-md"></div>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default GovernanceInfo;
