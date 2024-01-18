import { formatAddress } from '@/utils/format-address';
import copy from 'copy-to-clipboard';
import Image from 'next/image';
import React from 'react';
import { IoMdClose } from 'react-icons/io';

type Props = {
  tokenState: {
    tokenIcon: string;
    tokenName: string;
    tokenInfo: string;
    tokenAddress: string;
  };
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Modal = ({ tokenState, setShowModal }: Props) => {
  const handleCopy = (data: string) => {
    copy(data);
  };
  return (
    <div className="modal fixed w-[340px] h-full right-4 top-36 z-[20] rounded-[4px]">
      <div
        className="w-[340px] relative h-[200px] flex items-center justify-center border border-b-0 border-zinc-800"
        style={{
          background: 'url(/backgrounds/report.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      >
        <div className="p-3 rounded-full border border-dotted border-zinc-700 w-fit">
          <div className="p-3 rounded-full border border-dashed border-zinc-800 w-fit">
            <Image
              src={tokenState?.tokenIcon}
              alt="token-icons"
              width={48}
              height={48}
            />
          </div>
        </div>
        <button
          type="button"
          className="absolute top-2 left-2"
          onClick={() => {
            setShowModal(false);
          }}
        >
          <IoMdClose className="text-2xl text-zinc-400" />
        </button>
      </div>
      <div className="p-4 bg-[#0D0D0D] flex flex-col gap-4 border border-t-0 border-zinc-800">
        <div className="flex gap-2 items-center">
          <p className="text-zinc-200 text-[16px] text-bold">
            {tokenState?.tokenName}
          </p>
          {/* <p className="text-zinc-500 text-sm text-[400]">
            {tokenState?.tokenInfo}
          </p> */}
        </div>
        <div className="flex items-center gap-1">
          <p className="text-[13px] text-blue-400">
            {formatAddress(tokenState?.tokenAddress)}
          </p>
          <button
            type="button"
            onClick={() => handleCopy(tokenState?.tokenAddress)}
          >
            <Image src="/icons/copy.svg" alt="copy" width={12} height={12} />
          </button>
        </div>
        <div className="flex flex-col justify-center gap-6">
          <div className="h-[200px] overflow-y-scroll">
            {tokenState?.tokenInfo
              ?.split('.')
              ?.slice(0, -1)
              ?.map((item, i) => (
                <p
                  className="text-sm text-zinc-300 font-[300] flex items-center"
                  key={i}
                >
                  {item}.
                </p>
              ))}
          </div>
          <button className="bg-[#0E76FD] p-2 flex items-center justify-center gap-1 w-full">
            <Image
              src="/icons/nav/reports.svg"
              alt="report-icon"
              width={16}
              height={16}
              style={{
                filter: 'invert(100%) brightness(1000%) contrast(100%)',
              }}
            />
            <p className="text-[16px] font-[500] text-zinc-50">
              Download Report
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
