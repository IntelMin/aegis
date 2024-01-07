import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {};

const TokenDescription = (props: Props) => {
  return (
    <div>
      <div>
        <h1 className="text-neutral-200 text-[16px] font-[600]">
          TOKEN DESCRIPTION
        </h1>
        <p className="text-neutral-400 text-[12px]">
          OSMO is the first well-structured, easy-to-use platform for Ethereum
          scaling and infrastructure development. Its core component is Polygon
          SDK, a modular, flexible framework that supports building multiple
          types of applications.
        </p>
      </div>
      <div className="flex items-center gap-4 mt-3">
        <Link href="#" className="bg-zinc-900 p-2 rounded-[6px]">
          <Image
            src="/icons/social-web.svg"
            alt="social-icon"
            width={18}
            height={18}
          />
        </Link>
        <Link href="#" className="bg-zinc-900 p-2 rounded-[6px]">
          <Image
            src="/icons/social-twitter.svg"
            alt="social-icon"
            width={18}
            height={18}
          />
        </Link>
        <Link href="#" className="bg-zinc-900 p-2 rounded-[6px]">
          <Image
            src="/icons/social-telegram.svg"
            alt="social-icon"
            width={18}
            height={18}
          />
        </Link>
      </div>
    </div>
  );
};

export default TokenDescription;
