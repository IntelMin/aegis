import React from "react";

const TokenMarquee = () => {
  return (
    <div className="overflow-hidden">
      <p
        className="inline-block whitespace-nowrap text-white"
        style={{ animation: "marquee 10s linear infinite" }}
      >
        BTC, ETH, BNB, SOL, PEPE, DEF, KEL, SHIBA INU, CRYP, PLU, CALAC, LUPA,
        ION, MAK
      </p>
    </div>
  );
};

export default TokenMarquee;
