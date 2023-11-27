"use client";

import React from "react";
import CircleGraph from "@/components/circleGraph";
import RadialChart from "@/components/radialChart";

import { RiPagesLine } from "react-icons/ri";
import { Card, Chip } from "@nextui-org/react";
import Link from "next/link";

type Props = {
  name: string;
  symbol: string;
  address: string;
  circulating_market_cap: string;
  decimals: string;
  exchange_rate: string;
  holders: string;
  icon_url: string;
  total_supply: string;
  type: string;
};

const formatLargeNumber = (numberStr: string) => {
  if (typeof numberStr !== "string") {
    // Return a default value or handle the error
    return "0"; // or any other default/fallback value
  }

  let [integerPart, fractionalPart] = numberStr.split(".");
  fractionalPart = fractionalPart || "0";
  const shift = fractionalPart.length;
  const shiftedNumberStr = integerPart + fractionalPart;
  const number = BigInt(shiftedNumberStr); // This is now a whole number

  const scales = [
    { value: BigInt(1e3), symbol: "thousand" },
    { value: BigInt(1e6), symbol: "million" },
    { value: BigInt(1e9), symbol: "billion" },
    { value: BigInt(1e12), symbol: "trillion" },
    { value: BigInt(1e15), symbol: "quadrillion" },
    { value: BigInt(1e18), symbol: "quintillion" },
    { value: BigInt(1e21), symbol: "sextillion" },
    { value: BigInt(1e24), symbol: "septillion" },
  ];

  for (let i = scales.length - 1; i >= 0; i--) {
    const scale = scales[i];
    if (number >= scale.value * BigInt(10 ** shift)) {
      const scaledNumber = number / (scale.value * BigInt(10 ** shift));
      return `${scaledNumber.toString()} ${scale.symbol}`;
    }
  }

  return numberStr;
};

function calculateHealthScore(data: any) {
  let score = 0;

  // Example: Assume ideal holder count is at least 1000 for a full score
  const idealHolderCount = 1000;
  score += Math.min(data.holder_count / idealHolderCount, 1) * 25;

  // Consider liquidity in DEXs, with an arbitrary ideal liquidity value
  const idealLiquidity = 1000000; // Example value
  const liquidityScore = data.dex.reduce((acc:any, dex:any) => {
    return acc + parseFloat(dex.liquidity) / idealLiquidity;
  }, 0);
  score += Math.min(liquidityScore / data.dex.length, 1) * 25;

  // Total supply's deviation from a hypothetical ideal supply
  const idealTotalSupply = 1000000000; // Example value
  const supplyScore =
    1 - Math.abs(data.total_supply - idealTotalSupply) / idealTotalSupply;
  score += Math.max(supplyScore, 0) * 25;

  // Trading cooldown can be a positive or a negative based on context
  const cooldownEffect = data.trading_cooldown ? -10 : 10; // Example adjustment
  score += cooldownEffect;

  // Normalize score to be out of 100
  score = (score / 75) * 100; // Adjust 75 based on the max score attainable above

  score = Math.round(score);

  return Math.max(0, Math.min(score, 100)); // Ensure score is between 0 and 100
}

function calculateSecurityScore(data: any) {
  let score = 0;

  // Positive indicators
  const positiveIndicators = [
    data.is_open_source,
    data.is_anti_whale,
    data.is_whitelisted,
    !data.external_call,
    !data.can_take_back_ownership,
    !data.selfdestruct,
    !data.is_proxy,
  ];
  positiveIndicators.forEach((indicator) => {
    score += indicator ? 10 : 0; // Assign equal weight to all positive indicators

    console.log(indicator);
  });

  // Negative indicators
  const negativeIndicators = [data.is_blacklisted, data.is_honeypot];
  negativeIndicators.forEach((indicator) => {
    score -= indicator ? 20 : 0; // Assign higher weight to negative indicators
  });

  return Math.max(0, Math.min(score, 100)); // Ensure score is between 0 and 100
}

function calculateTrustScore(data: any) {
  let score = 0;

  // Check for transparency and fair distribution
  if (data.owner_address && data.owner_percent < 0.5) {
    score += 25; // Arbitrary value for ownership transparency
  }

  if (data.creator_percent < 0.5) {
    score += 25; // Arbitrary value for creator's share
  }

  // Check for liquidity lockup
  const lockedLiquidity = data.lp_holders.some(
    (holder: any) => holder.is_locked
  );
  score += lockedLiquidity ? 25 : 0;

  // Open source status
  score += data.is_open_source ? 25 : 0;

  return score; // Assume each factor contributes equally, no need to normalize
}

const AuditDetail = (data: any) => {
  const token = data.token;
  const total_supply = formatLargeNumber(token.total_supply);
  const market_cap = formatLargeNumber(token.circulating_market_cap);
  // const liquidity = formatLargeNumber(token.liquidity);

  const security = data.security;

  console.log("security: ", security);

  const healthScore = calculateHealthScore(security);
  const securityScore = calculateSecurityScore(security);
  const trustScore = calculateTrustScore(security);

  const score_series: number[] = [healthScore, securityScore, trustScore];

  console.log("score_series: ", score_series);

  const metadata = data.metadata;

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="items-center gap-4 mr-4 ">
        <div className="bg-[#2a2a2a52] px-3 py-[6px] rounded-lg mb-5">
          <h1 className="font-semibold text-[13px] text-default-500">
            Current Price
          </h1>
          <h3 className="font-semibold text-[18px] text-light">
            ${token.exchange_rate}
          </h3>
          {/* <p className="text-[12px] text-success">+5.35%</p> */}
        </div>
        
        <div className="bg-[#2a2a2a52] px-3 py-[6px] rounded-lg mb-5">
          <h1 className="font-semibold text-[13px] text-default-500">
            {"Supply"}
          </h1>
          <h3 className="font-semibold text-[18px] text-light">
            {total_supply}
          </h3>
          {/* <p className="text-[12px] text-success">+11.35%</p> */}
        </div>

        <div className="bg-[#2a2a2a52] px-3 py-[6px] rounded-lg mb-5">
          <h1 className="font-semibold text-[13px] text-default-500">
            {"Market Cap"}
          </h1>
          <h3 className="font-semibold text-[18px] text-light">
            ${market_cap}
          </h3>
          {/* <p className="text-[12px] text-success">+7.35%</p> */}
        </div>

        <div className="bg-[#2a2a2a52] px-3 py-[6px] rounded-lg mb-5">
          <h1 className="font-semibold text-[13px] text-default-500">
            {"Holders"}
          </h1>
          <h3 className="font-semibold text-[18px] text-light">
            {token.holders}
          </h3>
          {/* <p className="text-[12px] text-danger">-0.35%</p> */}
        </div>

        <div className="bg-[#2a2a2a52] px-3 py-[6px] rounded-lg mb-5">
          <h1 className="font-semibold text-[13px] text-default-500">
            {"Network"}
          </h1>
          <h3 className="font-semibold text-[18px] text-light">
            Ethereum
          </h3>
          {/* <p className="text-[12px] text-success">+11.35%</p> */}
        </div>
      </div>

      <Card className="flex flex-col w-full col-span-3 bg-gradient-to-tr from-[#1b1b1bbd] via-[#1b1b1bbd] to-gray-700 mr-4 bg-opacity-50 rounded-lg md:w-1/2 md:col-span-2 justify-left">
        <div className="p-2 pt-4 rounded-md glassCard">
          <div className="px-4">
            <div className="flex items-center justify-between">
              <h1 className="text-light font-bold text-[22px]">
                Audit Details
              </h1>
            </div>
          </div>

          <RadialChart {...score_series} />
        </div>
      </Card>

      <Card className="w-full bg-opacity-50 md:w-1/3 bg-gradient-to-tr from-[#191b1e] via-[#1b1b1bbd] to-gray-700">
        <div className="w-full max-w-sm p-6 mx-auto ">
          <h2 className="mb-4 text-lg font-semibold">{metadata.info.name}</h2>
          <p className="mb-4 text-sm text-gray-300">
            {metadata.explorerData.description}
          </p>
          {/* <div className="mb-2">
            <span className="text-gray-600">Audits</span>
            <span className="ml-2 text-green-600">1 Available</span>
          </div> */}
          <div className="mb-2">
            <span className="text-gray-300">Verified</span>
            <Chip className="ml-2 rounded-lg text-xs font-bold uppercase bg-gradient-to-r from-[#38383896] via-[#383838] to-gray-700">
              Yes
            </Chip>
          </div>
          <div className="mb-4">
            <span className="text-gray-300">Contract</span>
            <span className="ml-2 text-xs text-grey-300">{`${metadata.address.slice(
              0,
              6
            )}...${metadata.address.slice(-4)}`}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(metadata.socialLinks)
              .filter(([_, value]) => value)
              .filter(([key, value]) => value && key !== "__typename")
              .map(([key, value]) => (
                <Link
                  key={key}
                  href={value as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg py-[3px] px-[6px] text-[12px] font-bold uppercase bg-gradient-to-r from-[#38383896] via-[#383838] to-gray-700"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              ))}
          </div>
        </div>

        {/* <div className="flex p-4 rounded-md items-top">
          <span>
          <RiPagesLine className="text-white mr-1  mt-1 text-xl"/>
          </span>

          <div className="w-full bg-transparent">
            
            <p className="justify-end mt-2 text-2xl font-bold">Basic Checks</p>

          </div>
        </div> */}
      </Card>
    </div>
  );
};

export default AuditDetail;
