import React from "react";
import Title from "../title";
import BountyCard from "./bountyCard";

type Props = {
  noBlur?: boolean
};

const TrendingCards = (props: Props) => {
  return (
    <div>
      <Title subHeader title="Trending Bounties" />
      <div className="grid grid-cols-3 p-3 gap-3">
        <BountyCard
          name="Webmix"
          security="91.92"
          maxReward="$100,000"
          lastUpdated="Aug 23"
          assests="1"
          imgUrl="/webmix.jpeg"
          noBlur={props?.noBlur}
        />
        <BountyCard
          name="Decimal"
          security="92.02"
          maxReward="$100,000"
          lastUpdated="Sept 19"
          assests="1"
          imgUrl="/decimal.jpeg"
          noBlur={props?.noBlur}
        />
      </div>
    </div>
  );
};

export default TrendingCards;
