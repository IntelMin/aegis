import React, { useEffect } from 'react';
import Image from 'next/image';
import copy from 'copy-to-clipboard';
import { formatNumber } from '@/utils/format-number';
import { formatAge } from '@/utils/format-age';
import { formatAddress } from '@/utils/format-address';
import { Skeleton } from '@/components/ui/skeleton';
import { BiBadgeCheck, BiChevronDown, BiChevronUp } from 'react-icons/bi';
import TokenValueContainer from './token-value-container';
import { toast } from 'sonner';
import { TokenPrice } from './token-price';
import PaymentDialog from '@/components/payment/dialog';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useRouter } from 'next/navigation';

type Props = {
  showTitle: boolean;
  metadata: any;
  liveData: any;
  showQuickAudit: boolean;
  showAddressPair: boolean;
};

const TokenHeader = ({ showTitle, metadata, liveData, showQuickAudit, showAddressPair }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const router = useRouter();

  const handleCopy = (text: string) => () => {
    copy(text);
    toast('Copied to clipboard');
  };

  return (
    <div className="">
      <div className="flex flex-wrap max-md:flex-col md:items-center justify-around gap-4">
        <div
          className={`${
            showTitle ? '' : 'hidden'
          } flex-1 max-md:flex max-md:flex-row max-md:justify-between max-md:items-center max-md:gap-6`}
        >
          <div className="col-span-1 flex items-center justify-between">
            <div className="flex gap-2 items-start md:items-center">
              <Image
                src={
                  metadata?.imageSmallUrl
                    ? `/api/token/image?q=${metadata.imageSmallUrl}`
                    : `/icons/token-default.svg`
                }
                alt="token"
                width={32}
                height={32}
              />
              <div className="flex gap-2 max-md:flex-col md:items-center">
                {metadata?.name ? (
                  <h1 className="text-neutral-300 text-[24px] leading-[32px] font-600">
                    {metadata.name}
                  </h1>
                ) : (
                  <Skeleton className="w-20 h-6" />
                )}
                {metadata?.symbol ? (
                  <div className="flex gap-1 items-center">
                    <h3 className="text-neutral-500 text-[20px] leading-[24px] font-500">
                      {metadata.symbol}
                    </h3>
                    {metadata?.explorerData?.blueCheckmark && (
                      <BiBadgeCheck className="text-blue-300" />
                    )}
                  </div>
                ) : (
                  <Skeleton className="w-10 h-5" />
                )}
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <TokenPrice liveData={liveData} />
          </div>
        </div>

        <div className="flex-1 max-md:hidden">
          <TokenPrice liveData={liveData} />
        </div>

        { showAddressPair && <div className="flex max-md:hidden flex-end">
          <div className="flex flex-row items-center">
            {metadata && liveData ? (
              <>
                <div className="flex flex-col mr-1">
                  <p className="text-zinc-500 text-[14px] w-[70px] text-right">
                    {metadata?.symbol}:
                  </p>
                  <p className="text-zinc-500 text-[14px] w-[70px] text-right">
                    PAIR:{' '}
                  </p>
                </div>
                <div className="flex flex-col" // TODO: "Ox" the x doesn't appear in the same way for both addresses 
                >
                  <div
                    className="flex text-blue-400 cursor-pointer font-mono text-sm"
                    onClick={handleCopy(metadata.address)}
                  >
                    0x
                    {formatAddress(metadata.address).substring(2).toUpperCase()}
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
        </div>}

        <div className="flex flex-row max-md:flex-wrap flex-1 gap-4 md:gap-2">
          {/* <button
            className={` m-0 md:ml-5 flex items-center justify-center text-center ${
              loading ? 'bg-sky-200' : 'bg-[#0E76FD]'
            } font-weight-400 w-1/2 rounded-lg px-2 md:w-1/3 text-[16px]`}
            onClick={requestReport}
            disabled={loading}
          >
            {!loading ? 'Request Report' : 'Loading...'}
          </button>  */}
          {liveData ? (
            <>
              <TokenValueContainer
                name="MCAP"
                value={formatNumber(liveData.fdv, 1)}
              />
              <TokenValueContainer
                name="LIQUIDITY"
                value={formatNumber(liveData.liquidity.usd, 1)}
              />
              <TokenValueContainer
                name="VOL (24H)"
                value={formatNumber(liveData.volume.h24, 1)}
              />
              <TokenValueContainer
                name="AGE"
                value={formatAge(liveData.pairCreatedAt, true)}
              />
              { showQuickAudit &&
                <div className="max-md:w-full flex flex-col items-center justify-center w-fit gap-3">
                  <div
                    className={`bg-[#0E76FD] border-[#0E76FD] text-zinc-50 text-[16px] border font-[400] w-full px-2 py-6 flex items-center justify-center text-center transition-all ease-in duration-200`}
                  >
                    <PaymentDialog
                      service="quick"
                      address={'0x55A8f6c6b3Aa58ad6D1f26f6AFeDEd78F32E19f4'}
                      onPrep={async () => {
                        return true;
                      }}
                      UnlockedElement={
                        <div className="flex flex-row w-full items-center justify-center">
                          {submitting ? (
                            <>
                              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                              <p className="text-[16px] font-[600] text-zinc-50">
                                Loading...
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-[16px] font-[600] text-zinc-50">
                                Quick Audit
                              </p>
                            </>
                          )}
                        </div>
                      }
                      LockedElement={
                        <div className="flex flex-row items-center hover:cursor-pointer">
                          <p className="text-[16px] font-[600] text-zinc-50">
                            Quick Audit
                          </p>
                        </div>
                      }
                      onSuccess={() => {
                        setSubmitting(true);
                        router.push(`/audit/token/${'0x55A8f6c6b3Aa58ad6D1f26f6AFeDEd78F32E19f4'}/quick`);
                      }}
                    />
                  </div>
                </div>}
            </>
          ) : (
            <>
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-20 h-8" />
              {showQuickAudit && <Skeleton className="w-20 h-8" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenHeader;
