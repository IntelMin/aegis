import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import Attributes from './attributes';
import Statistics from './statistics';
import SecurityOverview from './security';
import copy from 'copy-to-clipboard';
import { toast } from 'sonner';
import { formatAddress } from '@/utils/format-address';

const ICON_SIZE = 18;

const TokenDetailOverView = ({
  tokenMetaData,
  tokenDetails,
  liveData,
}: any) => {
  const { explorerData, socialLinks } = tokenMetaData || {};

  const processDescription = (description: string) => {
    const questionRegex = /[^\.!\?]*\?/g;

    const sanitizedDescription = description.replace(questionRegex, '');
    const sentences = sanitizedDescription.match(/[^\.!\?]+[\.!\?]+/g) || [];

    const result = sentences.slice(0, 3).join(' ');

    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const handleCopy = (text: string) => () => {
    copy(text);
    toast('Copied to clipboard');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Token Description */}
      <div>
        {explorerData ? (
          <p className="text-neutral-400 text-xs leading-relaxed tracking-wide">
            {explorerData?.description
              ? processDescription(explorerData.description)
              : ''}
          </p>
        ) : (
          <>
            <Skeleton className="w-[90%] h-4" />
            <Skeleton className="w-[90%] h-4 mt-2" />
            <Skeleton className="w-1/2 h-4 mt-2" />
          </>
        )}
        {/* Social Links */}
        {socialLinks && (
          <div className="flex items-center justify-around gap-4 mt-3">
            {socialLinks.website && (
              <Link
                href={socialLinks.website}
                target="_blank"
                className="bg-zinc-900 p-2 w-full rounded-[6px] flex items-center justify-center"
              >
                <Image
                  src="/icons/social-web.svg"
                  alt="Website Icon"
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
              </Link>
            )}

            {socialLinks.twitter && (
              <Link
                href={socialLinks.twitter}
                target="_blank"
                className="bg-zinc-900 p-2 w-full rounded-[6px] flex items-center justify-center"
              >
                <Image
                  src="/icons/social-twitter.svg"
                  alt="Twitter Icon"
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
              </Link>
            )}

            {socialLinks.telegram && (
              <Link
                href={socialLinks.telegram}
                target="_blank"
                className="bg-zinc-900 p-2 w-full rounded-[6px] flex items-center justify-center"
              >
                <Image
                  src="/icons/social-telegram.svg"
                  alt="Telegram Icon"
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-between">
        {tokenMetaData && liveData ? (
          <>
            <div className="flex flex-col">
              <p className="text-[14px] w-[70px]">
                {tokenMetaData?.symbol}:
              </p>
              <p className="text-[14px] w-[70px]">
                PAIR:{' '}
              </p>
            </div>
            <div className="flex flex-col">
              {/* TODO: "Ox" the x doesn't appear in the same way for both addresses */}
              <div
                className="flex text-blue-400 cursor-pointer font-mono text-sm"
                onClick={handleCopy(tokenMetaData.address)}
              >
                0x
                {formatAddress(tokenMetaData.address).substring(2).toUpperCase()}
                <Image
                  src="/icons/copy.svg"
                  alt="copy"
                  width={16}
                  height={16}
                  className="ml-1"
                />
              </div>
              <div
                className="flex text-blue-400 cursor-pointer font-mono text-sm"
                onClick={handleCopy(liveData?.pairAddress)}
              >
                0x
                {formatAddress(liveData?.pairAddress)
                  .substring(2)
                  .toUpperCase()}
                <Image
                  src="/icons/copy.svg"
                  alt="copy"
                  width={16}
                  height={16}
                  className="ml-1"
                />
              </div>
            </div>
          </>
        ) : (
          <Skeleton className="w-24 h-6" />
        )}
      </div>
      {/* Token Info Set */}
      <Attributes tokenAddress={tokenMetaData?.address} />

      {/* Token Status in Price */}
      <Statistics liveData={liveData} />

      {/* Token Gauge Chart */}
      <SecurityOverview
        address={tokenMetaData?.address}
        showRadar={false}
        showDetails={true}
      />
    </div>
  );
};

export default TokenDetailOverView;
