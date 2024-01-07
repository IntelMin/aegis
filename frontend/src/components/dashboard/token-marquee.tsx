import React from 'react';
import Marquee from 'react-fast-marquee';

const TokenMarquee = ({ marqueeData }: any) => {
  if (!marqueeData) return null;
  const marqueeContent = marqueeData?.map((token: any, index: number) => (
    <span key={index} className="flex items-center mr-8">
      <img
        src={
          token.imageSmallUrl
            ? `/api/token-image?q=${token.imageSmallUrl.split('/').pop()}`
            : `/icons/token-default.svg`
        }
        alt={token.newToken}
        className="w-4 h-4 mr-2"
      />

      <span className="text-white">{token[token.newToken].name}</span>

      <span className="ml-2 text-white">
        $
        {parseFloat(token.priceUsd) > 0.0
          ? parseFloat(token.priceUsd).toFixed(2)
          : parseFloat(token.priceUsd).toFixed(6)}
      </span>
      <span
        className={`ml-2 ${
          token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {token.change >= 0
          ? `+${token.priceChange.toFixed(2)}`
          : token.priceChange.toFixed(2)}
        %
      </span>
    </span>
  ));
  return (
    <div className="relative flex overflow-hidden">
      <Marquee>{marqueeContent}</Marquee>
    </div>
  );
};

export default TokenMarquee;
