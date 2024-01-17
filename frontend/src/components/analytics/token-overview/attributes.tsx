import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { formatAddress } from '@/utils/format-address';
import { formatNumber } from '@/utils/format-number';
import { FileWarningIcon } from 'lucide-react';
import {
  BiCheckShield,
  BiCross,
  BiError,
  BiSolidCheckboxMinus,
} from 'react-icons/bi';

const TokenAttributes = ({ tokenAddress }: any) => {
  const [loading, setLoading] = useState(true);
  const [attributes, setAttributes] = useState([
    {
      key: 'Total Supply',
      value: '', // Initially set as empty string or you could use a placeholder like 'Loading...'
      description: 'Amount of tokens minted',
    },
    {
      key: 'LP Holder(s)',
      value: '',
      description: 'Entities holding Liquidity Pools',
    },
    {
      key: 'Opensource',
      value: '',
      description: 'Is the contract code available and verified?',
      boolean: true,
      good: true,
    },
    {
      key: 'Anti-whale',
      value: '',
      description: 'Is there a max transaction limit?',
      boolean: true,
      good: false,
    },
    {
      key: 'Ownership Renounced',
      value: '',
      description: 'Has the owner renounced ownership?',
      boolean: true,
      good: true,
    },
    {
      key: 'Mintable',
      value: '',
      description: 'Can the contract mint new tokens?',
      boolean: true,
      good: false,
    },
    {
      key: 'Blacklist',
      value: '',
      description: 'Can the contract blacklist wallets?',
      boolean: true,
      good: false,
    },
  ]);

  useEffect(() => {
    console.log('tokenAddress: ', tokenAddress);
    if (!tokenAddress) return;

    const fetchData = async () => {
      axios
        .get(`/api/token/info?address=${tokenAddress}&type=security`)
        .then(response => {
          const data = response.data;

          console.log('security data: ', data);

          let ownership_renounced = 0;
          const burn_addresses = [
            '0x000000000000000000000000000000000000dead',
            '0x0000000000000000000000000000000000000000',
          ];
          if (burn_addresses.includes(data.owner_address.toLowerCase())) {
            ownership_renounced = 1;
            console.log('ownership_renounced: ', ownership_renounced);
          }

          setAttributes(
            attributes.map(attr => ({
              ...attr,
              value:
                attr.key === 'Total Supply'
                  ? data.total_supply
                  : attr.key === 'LP Holder(s)'
                  ? data.lp_holder_count
                  : attr.key === 'Opensource'
                  ? data.is_open_source
                  : attr.key === 'Anti-whale'
                  ? data.is_anti_whale
                  : attr.key === 'Ownership Renounced'
                  ? ownership_renounced
                  : attr.key === 'Mintable'
                  ? data.is_mintable
                  : attr.key === 'Blacklist'
                  ? data.is_blacklisted
                  : attr.value,
            }))
          );

          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching live data:', error);
          setLoading(false);
        });
    };

    fetchData();
  }, [tokenAddress]);

  //   if (loading) {
  //     return (
  //       <div className="w-full">
  //         <Skeleton className="w-full h-96" />
  //       </div>
  //     );
  //   }

  return (
    <div className="w-full pt-3">
      <TooltipProvider>
        {attributes.map((attribute: any) => (
          <div
            className="w-full flex items-center justify-between py-1"
            key={attribute.key}
          >
            <div className="flex gap-[4px] items-center">
              <p className="text-zinc-500 text-[12px] font-semibold">
                {attribute.key}
              </p>
              <Tooltip>
                <TooltipTrigger>
                  <Image
                    src="/icons/info.svg"
                    alt="info-icon"
                    width={13}
                    height={13}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{attribute.description}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {loading ? (
              <Skeleton className="w-6 h-2" />
            ) : (
              <p className="text-zinc-400 text-[14px]">
                {attribute.boolean
                  ? (() => {
                      const isValueGood = attribute?.value === '1'; // assuming '1' is good and '0' is bad
                      return isValueGood !== attribute?.good ? (
                        <BiError className="text-orange-700" />
                      ) : (
                        <BiCheckShield className="text-green-700" />
                      );
                    })()
                  : formatNumber(attribute.value)}
              </p>
            )}
          </div>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default TokenAttributes;
