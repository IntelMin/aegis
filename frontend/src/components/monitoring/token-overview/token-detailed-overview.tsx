import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TokenInfoSet from './token-info-set';
import TokenStatCard from './token-stat-card';
import TokenSecurityScoreChart from '../token-security-score-chart';

const ICON_SIZE = 18;

const TokenDetailOverView = ({
  tokenMetaData,
  tokenDetails,
  liveData,
}: any) => {
  const { explorerData, socialLinks } = tokenMetaData || {};
  return (
    <>
      {/* Token Description */}
      <div>
        <p className="text-neutral-400 text-[12px]">
          {explorerData?.description || ''}
        </p>
      </div>

      {/* Social Links */}
      {socialLinks && (
        <div className="flex items-center gap-4 mb-3">
          {socialLinks.website && (
            <Link
              href={socialLinks.website}
              target="_blank"
              className="bg-zinc-900 p-2 rounded-[6px]"
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
              className="bg-zinc-900 p-2 rounded-[6px]"
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
              className="bg-zinc-900 p-2 rounded-[6px]"
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

      {/* Token Info Set */}
      <TokenInfoSet tokenDetails={tokenDetails} />

      {/* Token Status in Price */}
      <TokenStatCard liveData={liveData} />

      {/* Token Gauge Chart */}
      <TokenSecurityScoreChart />
    </>
  );
};

export default TokenDetailOverView;
